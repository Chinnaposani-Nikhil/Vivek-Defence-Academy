import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminTable from '../../components/admin/ui/AdminTable';
import AdminModal from '../../components/admin/ui/AdminModal';
import { BookOpen, Trash2, Edit, Eye, Image as ImageIcon } from 'lucide-react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const initialFormState = {
    name: '', duration: '', fee: '', eligibility: '', description: '', imageUrl: '', status: 'Active'
  };
  const [formData, setFormData] = useState(initialFormState);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filtering
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totals = { Total: courses.length, Active: 0, Inactive: 0 };
    courses.forEach(c => {
      if (c.status === 'Active') totals.Active++;
      if (c.status === 'Inactive') totals.Inactive++;
    });
    return totals;
  }, [courses]);

  const handleOpenForm = (course = null) => {
    if (course) {
      setFormData(course);
      setIsEditing(true);
    } else {
      setFormData(initialFormState);
      setIsEditing(false);
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'courses', formData.id), {
          ...formData,
          fee: Number(formData.fee),
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'courses'), {
          ...formData,
          fee: Number(formData.fee),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Failed to save course", err);
      alert("Failed to save course details.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course? This action is permanent and may affect student records tied to this course.")) {
      try {
        await deleteDoc(doc(db, 'courses', id));
        setIsViewModalOpen(false);
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete course.");
      }
    }
  };

  const columns = [
    { header: "Course Name", accessor: "name", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
          {row.imageUrl ? <img src={row.imageUrl} alt={row.name} className="w-full h-full object-cover" /> : <BookOpen className="w-5 h-5 text-gray-400" />}
        </div>
        <span className="font-semibold text-gray-900">{row.name}</span>
      </div>
    )},
    { header: "Duration", accessor: "duration", render: (row) => <span className="text-gray-600">{row.duration || 'N/A'}</span> },
    { header: "Fee", accessor: "fee", render: (row) => <span className="font-medium text-gray-900">₹{row.fee || 0}</span> },
    { header: "Status", accessor: "status", render: (row) => (
      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
        row.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
      }`}>
        {row.status || 'Active'}
      </span>
    )},
    { header: "Actions", accessor: "actions", render: (row) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setSelectedCourse(row); setIsViewModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="View"><Eye className="w-4 h-4" /></button>
        <button onClick={() => handleOpenForm(row)} className="p-1.5 text-military-green hover:bg-military-green/10 rounded-sm transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <>
      <AdminPageHeader 
        title="Manage Courses" 
        subtitle="Add, update, or remove training programs."
        actionText="Add Course"
        onAction={() => handleOpenForm()}
        searchPlaceholder="Search courses..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={[
          { label: "All Status", value: "All" },
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" }
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Courses", value: stats.Total, color: "text-gray-900" },
          { label: "Active Courses", value: stats.Active, color: "text-green-600" },
          { label: "Inactive Courses", value: stats.Inactive, color: "text-red-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-oswald uppercase tracking-wider text-gray-500 mb-1">{s.label}</p>
            <h4 className={`text-3xl font-bebas tracking-wider ${s.color}`}>{s.value}</h4>
          </div>
        ))}
      </div>

      <AdminTable columns={columns} data={filteredCourses} loading={loading} />

      {/* Form Modal */}
      <AdminModal isOpen={isFormModalOpen} onClose={() => !formLoading && setIsFormModalOpen(false)} title={isEditing ? "Edit Course" : "Add New Course"} maxWidth="max-w-2xl">
        <form onSubmit={handleFormSubmit} className="space-y-4 font-inter text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Course Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Duration</label>
              <input type="text" required value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="e.g. 6 Months" />
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Total Fee (₹)</label>
              <input type="number" required value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Eligibility Criteria</label>
              <input type="text" value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="e.g. 10th/12th Pass, Age 17.5 - 21" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Image URL</label>
              <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="https://..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Description</label>
              <textarea rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none resize-none"></textarea>
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-sm text-sm font-oswald uppercase tracking-wider transition-colors">Cancel</button>
            <button type="submit" disabled={formLoading} className="px-6 py-2 bg-military-green hover:bg-army-olive text-white rounded-sm text-sm font-oswald uppercase tracking-wider transition-colors disabled:opacity-50">
              {formLoading ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* View Modal */}
      <AdminModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Course Details" maxWidth="max-w-xl">
        {selectedCourse && (
          <div className="space-y-6">
            {selectedCourse.imageUrl && (
              <img src={selectedCourse.imageUrl} alt={selectedCourse.name} className="w-full h-48 object-cover rounded-sm border border-gray-200" />
            )}
            
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bebas text-3xl text-military-green tracking-wider">{selectedCourse.name}</h4>
                <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                  selectedCourse.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {selectedCourse.status || 'Active'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-gray-50 border border-gray-100 rounded-sm text-sm font-inter">
                <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Duration:</span> <br/><span className="font-medium">{selectedCourse.duration || 'N/A'}</span></div>
                <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Fee:</span> <br/><span className="font-medium">₹{selectedCourse.fee || 0}</span></div>
                <div className="col-span-2"><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Eligibility:</span> <br/>{selectedCourse.eligibility || 'N/A'}</div>
              </div>

              <div>
                <h5 className="font-oswald uppercase tracking-wider text-xs text-gray-500 mb-2">Description</h5>
                <p className="text-gray-700 text-sm font-inter leading-relaxed whitespace-pre-wrap">{selectedCourse.description}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
};

export default ManageCourses;
