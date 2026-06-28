import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminTable from '../../components/admin/ui/AdminTable';
import AdminModal from '../../components/admin/ui/AdminModal';
import { MessageSquareQuote, Trash2, Edit, Eye, Star } from 'lucide-react';

const COURSES = ['Army (GD)', 'Navy', 'Air Force', 'Police (SI/Constable)', 'SSC GD', 'Agniveer', 'Physical Training'];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const initialFormState = {
    studentName: '', course: COURSES[0], review: '', rating: 5, photoUrl: '', status: 'Pending'
  };
  const [formData, setFormData] = useState(initialFormState);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonials(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filtering
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(t => {
      const matchesSearch = (t.studentName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [testimonials, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totals = { Pending: 0, Approved: 0, Rejected: 0 };
    testimonials.forEach(t => {
      if (t.status === 'Pending') totals.Pending++;
      if (t.status === 'Approved') totals.Approved++;
      if (t.status === 'Rejected') totals.Rejected++;
    });
    return totals;
  }, [testimonials]);

  const handleOpenForm = (testimonial = null) => {
    if (testimonial) {
      setFormData(testimonial);
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
        await updateDoc(doc(db, 'testimonials', formData.id), {
          ...formData,
          rating: Number(formData.rating),
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...formData,
          rating: Number(formData.rating),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Failed to save testimonial", err);
      alert("Failed to save review details.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      if (selectedTestimonial && selectedTestimonial.id === id) {
        setSelectedTestimonial({ ...selectedTestimonial, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this testimonial?")) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        setIsViewModalOpen(false);
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete testimonial.");
      }
    }
  };

  const columns = [
    { header: "Student", accessor: "name", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
          {row.photoUrl ? <img src={row.photoUrl} alt={row.studentName} className="w-full h-full object-cover" /> : <MessageSquareQuote className="w-4 h-4 text-gray-400" />}
        </div>
        <div>
          <span className="font-semibold text-gray-900 block">{row.studentName}</span>
          <span className="text-gray-500 text-xs">{row.course}</span>
        </div>
      </div>
    )},
    { header: "Rating", accessor: "rating", render: (row) => (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < (row.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
        ))}
      </div>
    )},
    { header: "Review Extract", accessor: "review", render: (row) => (
      <span className="text-gray-600 truncate max-w-[200px] inline-block" title={row.review}>
        "{row.review}"
      </span>
    )},
    { header: "Date", accessor: "date", render: (row) => {
      const d = row.createdAt?.toDate ? row.createdAt.toDate() : new Date();
      return <span className="text-gray-500">{d.toLocaleDateString('en-IN')}</span>
    }},
    { header: "Status", accessor: "status", render: (row) => {
      const s = row.status || 'Pending';
      let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
      if (s === 'Pending') colorClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
      if (s === 'Approved') colorClass = "bg-green-50 text-green-700 border-green-200";
      if (s === 'Rejected') colorClass = "bg-red-50 text-red-700 border-red-200";

      return (
        <select 
          value={s}
          onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${colorClass}`}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      );
    }},
    { header: "Actions", accessor: "actions", render: (row) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setSelectedTestimonial(row); setIsViewModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="View"><Eye className="w-4 h-4" /></button>
        <button onClick={() => handleOpenForm(row)} className="p-1.5 text-military-green hover:bg-military-green/10 rounded-sm transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <>
      <AdminPageHeader 
        title="Testimonials & Reviews" 
        subtitle="Manage student feedback and public testimonials."
        actionText="Add Testimonial"
        onAction={() => handleOpenForm()}
        searchPlaceholder="Search by student name..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={[
          { label: "All Status", value: "All" },
          { label: "Pending", value: "Pending" },
          { label: "Approved", value: "Approved" },
          { label: "Rejected", value: "Rejected" }
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending Approval", value: stats.Pending, color: "text-yellow-600" },
          { label: "Approved Reviews", value: stats.Approved, color: "text-green-600" },
          { label: "Rejected Reviews", value: stats.Rejected, color: "text-red-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-oswald uppercase tracking-wider text-gray-500 mb-1">{s.label}</p>
            <h4 className={`text-3xl font-bebas tracking-wider ${s.color}`}>{s.value}</h4>
          </div>
        ))}
      </div>

      <AdminTable columns={columns} data={filteredTestimonials} loading={loading} />

      {/* Form Modal */}
      <AdminModal isOpen={isFormModalOpen} onClose={() => !formLoading && setIsFormModalOpen(false)} title={isEditing ? "Edit Testimonial" : "Add New Testimonial"} maxWidth="max-w-xl">
        <form onSubmit={handleFormSubmit} className="space-y-4 font-inter text-sm">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Student Name</label>
              <input type="text" required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Course Enrolled</label>
                <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white">
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Rating (1-5)</label>
                <input type="number" min="1" max="5" required value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Photo URL (Optional)</label>
              <input type="url" value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Review</label>
              <textarea rows="4" required value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none resize-none"></textarea>
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white">
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-sm text-sm font-oswald uppercase tracking-wider transition-colors">Cancel</button>
            <button type="submit" disabled={formLoading} className="px-6 py-2 bg-military-green hover:bg-army-olive text-white rounded-sm text-sm font-oswald uppercase tracking-wider transition-colors disabled:opacity-50">
              {formLoading ? 'Saving...' : 'Save Review'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* View Modal */}
      <AdminModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Testimonial Details" maxWidth="max-w-xl">
        {selectedTestimonial && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-3">
                {selectedTestimonial.photoUrl ? <img src={selectedTestimonial.photoUrl} alt={selectedTestimonial.studentName} className="w-full h-full object-cover" /> : <MessageSquareQuote className="w-8 h-8 text-gray-300" />}
              </div>
              <h4 className="font-bebas text-2xl text-military-green tracking-wider">{selectedTestimonial.studentName}</h4>
              <p className="text-sm font-inter text-gray-500 mb-2">{selectedTestimonial.course}</p>
              
              <div className="flex justify-center items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < (selectedTestimonial.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>

              <div className="relative w-full">
                <span className="absolute -top-4 -left-2 text-6xl text-gray-100 font-serif leading-none">"</span>
                <p className="text-gray-700 text-lg font-inter italic relative z-10 px-6 py-2">
                  {selectedTestimonial.review}
                </p>
                <span className="absolute -bottom-6 -right-2 text-6xl text-gray-100 font-serif leading-none">"</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-6">
              <div>
                <p className="text-xs text-gray-500 font-oswald uppercase tracking-wider">Current Status</p>
                <p className={`font-semibold ${
                  selectedTestimonial.status === 'Pending' ? 'text-yellow-600' :
                  selectedTestimonial.status === 'Approved' ? 'text-green-600' : 'text-red-600'
                }`}>{selectedTestimonial.status}</p>
              </div>
              <div className="flex gap-2">
                {selectedTestimonial.status !== 'Approved' && (
                  <button onClick={() => handleUpdateStatus(selectedTestimonial.id, 'Approved')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-sm text-xs font-inter transition-colors">
                    Approve
                  </button>
                )}
                {selectedTestimonial.status !== 'Rejected' && (
                  <button onClick={() => handleUpdateStatus(selectedTestimonial.id, 'Rejected')} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-sm text-xs font-inter transition-colors">
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
};

export default Testimonials;
