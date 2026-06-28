import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminTable from '../../components/admin/ui/AdminTable';
import AdminModal from '../../components/admin/ui/AdminModal';
import { Users, Trash2, Edit, Eye, UserPlus, Image as ImageIcon } from 'lucide-react';

const COURSES = ['Army (GD)', 'Navy', 'Air Force', 'Police (SI/Constable)', 'SSC GD', 'Agniveer', 'Physical Training'];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  
  // Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const initialFormState = {
    studentId: '', name: '', fatherName: '', motherName: '', dob: '', gender: 'Male',
    email: '', phone: '', alternatePhone: '', address: '', course: COURSES[0],
    batch: '', joiningDate: '', feeAmount: 0, paidFee: 0, status: 'Active', remarks: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching students: ", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtering
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = 
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.phone || '').includes(searchTerm);
      const matchesCourse = courseFilter === 'All' ? true : s.course === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [students, searchTerm, courseFilter]);

  // Statistics
  const stats = useMemo(() => {
    const counts = { Total: students.length, Army: 0, Navy: 0, AirForce: 0, Police: 0, Agniveer: 0 };
    students.forEach(s => {
      if (s.course === 'Army (GD)') counts.Army++;
      if (s.course === 'Navy') counts.Navy++;
      if (s.course === 'Air Force') counts.AirForce++;
      if (s.course === 'Police (SI/Constable)') counts.Police++;
      if (s.course === 'Agniveer') counts.Agniveer++;
    });
    return counts;
  }, [students]);

  // Actions
  const handleOpenForm = (student = null) => {
    if (student) {
      setFormData(student);
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
      const pendingFee = Number(formData.feeAmount) - Number(formData.paidFee);
      const finalData = { ...formData, pendingFee };

      if (isEditing) {
        await updateDoc(doc(db, 'students', formData.id), {
          ...finalData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'students'), {
          ...finalData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Failed to save student", err);
      alert("Failed to save student details.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this student? This action is permanent.")) {
      try {
        await deleteDoc(doc(db, 'students', id));
        setIsViewModalOpen(false);
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete student.");
      }
    }
  };

  const columns = [
    { header: "ID", accessor: "studentId", render: (row) => <span className="font-oswald tracking-wider text-xs bg-gray-100 px-2 py-1 rounded-sm">{row.studentId || 'N/A'}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-semibold text-gray-900">{row.name}</span> },
    { header: "Contact", accessor: "contact", render: (row) => <span className="text-gray-600">{row.phone}</span> },
    { header: "Course", accessor: "course", render: (row) => <span className="bg-military-green/10 text-military-green px-2 py-1 rounded-sm text-[10px] font-medium uppercase tracking-wider">{row.course}</span> },
    { header: "Status", accessor: "status", render: (row) => {
      const active = row.status === 'Active';
      return <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{row.status || 'Active'}</span>
    }},
    { header: "Fee Status", accessor: "fee", render: (row) => {
      const pending = row.pendingFee > 0;
      return <span className={`text-xs font-inter font-medium ${pending ? 'text-red-600' : 'text-green-600'}`}>{pending ? `₹${row.pendingFee} Pending` : 'Cleared'}</span>
    }},
    { header: "Actions", accessor: "actions", render: (row) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setSelectedStudent(row); setIsViewModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="View"><Eye className="w-4 h-4" /></button>
        <button onClick={() => handleOpenForm(row)} className="p-1.5 text-military-green hover:bg-military-green/10 rounded-sm transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <>
      <AdminPageHeader 
        title="Student Management" 
        subtitle="Manage enrolled students, fees, and batches."
        actionText="Add Student"
        onAction={() => handleOpenForm()}
        searchPlaceholder="Search by ID, name, phone..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={[
          { label: "All Courses", value: "All" },
          ...COURSES.map(c => ({ label: c, value: c }))
        ]}
        activeFilter={courseFilter}
        onFilterChange={setCourseFilter}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total", value: stats.Total, color: "text-gray-900" },
          { label: "Army", value: stats.Army, color: "text-military-green" },
          { label: "Navy", value: stats.Navy, color: "text-blue-600" },
          { label: "Air Force", value: stats.AirForce, color: "text-sky-600" },
          { label: "Police", value: stats.Police, color: "text-amber-600" },
          { label: "Agniveer", value: stats.Agniveer, color: "text-purple-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-3 rounded-sm border border-gray-200 shadow-sm text-center">
            <h4 className={`text-xl font-bebas tracking-wider ${s.color}`}>{s.value}</h4>
            <p className="text-[9px] font-oswald uppercase tracking-wider text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminTable 
        columns={columns} 
        data={filteredStudents} 
        loading={loading}
      />

      {/* View Modal */}
      <AdminModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Student Profile" maxWidth="max-w-2xl">
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-start gap-6 border-b border-gray-100 pb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-sm border-2 border-gray-200 flex items-center justify-center shrink-0">
                {selectedStudent.photoUrl ? (
                  <img src={selectedStudent.photoUrl} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bebas text-military-green tracking-wider">{selectedStudent.name}</h3>
                    <p className="text-sm text-gray-500 font-inter">ID: {selectedStudent.studentId || 'N/A'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${selectedStudent.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {selectedStudent.status || 'Active'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-inter">
                  <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Course:</span> <br/>{selectedStudent.course}</div>
                  <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Batch:</span> <br/>{selectedStudent.batch || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm font-inter">
              <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Father's Name:</span> <br/>{selectedStudent.fatherName || '-'}</div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Mother's Name:</span> <br/>{selectedStudent.motherName || '-'}</div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">DOB:</span> <br/>{selectedStudent.dob || '-'} ({selectedStudent.gender || '-'})</div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Joining Date:</span> <br/>{selectedStudent.joiningDate || '-'}</div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Phone:</span> <br/>{selectedStudent.phone || '-'}</div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Alternate Phone:</span> <br/>{selectedStudent.alternatePhone || '-'}</div>
              <div className="col-span-2"><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Email:</span> <br/>{selectedStudent.email || '-'}</div>
              <div className="col-span-2"><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Address:</span> <br/>{selectedStudent.address || '-'}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
              <h4 className="font-bebas text-lg text-military-green tracking-wider mb-3">Fee Status</h4>
              <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-200">
                <div>
                  <p className="text-[10px] font-oswald uppercase tracking-wider text-gray-500">Total Fee</p>
                  <p className="font-semibold text-gray-900 mt-1">₹{selectedStudent.feeAmount || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] font-oswald uppercase tracking-wider text-gray-500">Paid Fee</p>
                  <p className="font-semibold text-green-600 mt-1">₹{selectedStudent.paidFee || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] font-oswald uppercase tracking-wider text-gray-500">Pending</p>
                  <p className={`font-semibold mt-1 ${selectedStudent.pendingFee > 0 ? 'text-red-600' : 'text-gray-900'}`}>₹{selectedStudent.pendingFee || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Form Modal */}
      <AdminModal isOpen={isFormModalOpen} onClose={() => !formLoading && setIsFormModalOpen(false)} title={isEditing ? "Edit Student" : "Add New Student"} maxWidth="max-w-3xl">
        <form onSubmit={handleFormSubmit} className="space-y-4 font-inter text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Student ID (Roll No)</label>
              <input type="text" required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Course</label>
              <select required value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white">
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Batch</label>
              <input type="text" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="e.g. Morning 2026" />
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Phone Number</label>
              <input type="tel" required value={formData.phone} minLength={10} maxLength={10} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Alternate Phone</label>
              <input type="tel" value={formData.alternatePhone} minLength={10} maxLength={10} onChange={e => setFormData({...formData, alternatePhone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Date of Birth</label>
              <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Father's Name</label>
              <input type="text" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Mother's Name</label>
              <input type="text" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Address</label>
              <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none resize-none"></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Total Fee Amount (₹)</label>
                <input type="number" required value={formData.feeAmount} onChange={e => setFormData({...formData, feeAmount: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
              </div>
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Fee Paid (₹)</label>
                <input type="number" required value={formData.paidFee} onChange={e => setFormData({...formData, paidFee: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
              </div>
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Joining Date</label>
                <input type="date" required value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-sm text-sm font-oswald uppercase tracking-wider transition-colors">Cancel</button>
            <button type="submit" disabled={formLoading} className="px-6 py-2 bg-military-green hover:bg-army-olive text-white rounded-sm text-sm font-oswald uppercase tracking-wider transition-colors disabled:opacity-50">
              {formLoading ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
};

export default Students;
