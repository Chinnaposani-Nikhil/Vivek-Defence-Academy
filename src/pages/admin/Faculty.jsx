import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminTable from '../../components/admin/ui/AdminTable';
import AdminModal from '../../components/admin/ui/AdminModal';
import { UserSquare2, Trash2, Edit, Eye, Mail, Phone, ExternalLink } from 'lucide-react';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const initialFormState = {
    name: '', designation: '', qualification: '', experience: '', 
    specialization: '', description: '', email: '', phone: '', 
    linkedin: '', photoUrl: '', status: 'Active'
  };
  const [formData, setFormData] = useState(initialFormState);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'faculty'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFaculty(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filtering
  const filteredFaculty = useMemo(() => {
    return faculty.filter(f => {
      return (f.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
             (f.specialization || '').toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [faculty, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totals = { Total: faculty.length, Active: 0 };
    faculty.forEach(f => {
      if (f.status === 'Active') totals.Active++;
    });
    return totals;
  }, [faculty]);

  const handleOpenForm = (fac = null) => {
    if (fac) {
      setFormData(fac);
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
        await updateDoc(doc(db, 'faculty', formData.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'faculty'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Failed to save faculty", err);
      alert("Failed to save faculty details.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this faculty member?")) {
      try {
        await deleteDoc(doc(db, 'faculty', id));
        setIsViewModalOpen(false);
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete faculty member.");
      }
    }
  };

  const columns = [
    { header: "Faculty", accessor: "name", render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
          {row.photoUrl ? <img src={row.photoUrl} alt={row.name} className="w-full h-full object-cover" /> : <UserSquare2 className="w-5 h-5 text-gray-400" />}
        </div>
        <div>
          <span className="font-semibold text-gray-900 block">{row.name}</span>
          <span className="text-gray-500 text-xs">{row.designation}</span>
        </div>
      </div>
    )},
    { header: "Specialization", accessor: "specialization", render: (row) => <span className="text-gray-600">{row.specialization || 'N/A'}</span> },
    { header: "Experience", accessor: "experience", render: (row) => <span className="text-gray-600">{row.experience || 'N/A'}</span> },
    { header: "Status", accessor: "status", render: (row) => (
      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
        row.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
      }`}>
        {row.status || 'Active'}
      </span>
    )},
    { header: "Actions", accessor: "actions", render: (row) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setSelectedFaculty(row); setIsViewModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="View"><Eye className="w-4 h-4" /></button>
        <button onClick={() => handleOpenForm(row)} className="p-1.5 text-military-green hover:bg-military-green/10 rounded-sm transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <>
      <AdminPageHeader 
        title="Faculty Management" 
        subtitle="Manage academy instructors and staff."
        actionText="Add Faculty"
        onAction={() => handleOpenForm()}
        searchPlaceholder="Search by name or specialization..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { label: "Total Faculty", value: stats.Total, color: "text-gray-900" },
          { label: "Active Faculty", value: stats.Active, color: "text-green-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-oswald uppercase tracking-wider text-gray-500 mb-1">{s.label}</p>
            <h4 className={`text-3xl font-bebas tracking-wider ${s.color}`}>{s.value}</h4>
          </div>
        ))}
      </div>

      <AdminTable columns={columns} data={filteredFaculty} loading={loading} />

      {/* Form Modal */}
      <AdminModal isOpen={isFormModalOpen} onClose={() => !formLoading && setIsFormModalOpen(false)} title={isEditing ? "Edit Faculty" : "Add New Faculty"} maxWidth="max-w-2xl">
        <form onSubmit={handleFormSubmit} className="space-y-4 font-inter text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Designation</label>
              <input type="text" required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="e.g. Senior Instructor" />
            </div>
            
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Qualification</label>
              <input type="text" required value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="e.g. M.Sc, Ex-Army" />
            </div>
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Experience</label>
              <input type="text" required value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="e.g. 10 Years" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Specialization</label>
              <input type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="e.g. Physical Training, Mathematics" />
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>
            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">LinkedIn URL</label>
              <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Photo URL</label>
              <input type="url" value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="https://..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Bio / Description</label>
              <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none resize-none"></textarea>
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
              {formLoading ? 'Saving...' : 'Save Faculty'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* View Modal */}
      <AdminModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Faculty Profile" maxWidth="max-w-xl">
        {selectedFaculty && (
          <div className="space-y-6">
            <div className="flex gap-6 items-start border-b border-gray-100 pb-6">
              <div className="w-24 h-24 rounded-sm bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                {selectedFaculty.photoUrl ? <img src={selectedFaculty.photoUrl} alt={selectedFaculty.name} className="w-full h-full object-cover" /> : <UserSquare2 className="w-8 h-8 text-gray-400" />}
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <h4 className="font-bebas text-3xl text-military-green tracking-wider">{selectedFaculty.name}</h4>
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                    selectedFaculty.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {selectedFaculty.status || 'Active'}
                  </span>
                </div>
                <p className="font-inter text-gray-600 font-medium">{selectedFaculty.designation}</p>
                <div className="flex gap-4 mt-2">
                  {selectedFaculty.phone && <a href={`tel:${selectedFaculty.phone}`} className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"><Phone className="w-3 h-3" /> {selectedFaculty.phone}</a>}
                  {selectedFaculty.email && <a href={`mailto:${selectedFaculty.email}`} className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"><Mail className="w-3 h-3" /> Email</a>}
                  {selectedFaculty.linkedin && <a href={selectedFaculty.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline"><ExternalLink className="w-3 h-3" /> LinkedIn</a>}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-100 rounded-sm text-sm font-inter">
              <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Specialization:</span> <br/><span className="font-medium">{selectedFaculty.specialization || 'N/A'}</span></div>
              <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Qualification:</span> <br/><span className="font-medium">{selectedFaculty.qualification || 'N/A'}</span></div>
              <div className="col-span-2"><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Experience:</span> <br/>{selectedFaculty.experience || 'N/A'}</div>
            </div>

            <div>
              <h5 className="font-oswald uppercase tracking-wider text-xs text-gray-500 mb-2">Bio</h5>
              <p className="text-gray-700 text-sm font-inter leading-relaxed whitespace-pre-wrap">{selectedFaculty.description || 'No biography provided.'}</p>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
};

export default Faculty;
