import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminTable from '../../components/admin/ui/AdminTable';
import AdminModal from '../../components/admin/ui/AdminModal';
import { Users, PhoneCall, MessageSquare, CheckCircle, Mail, Phone, ExternalLink, Trash2, Edit, Eye } from 'lucide-react';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEnquiries(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching enquiries: ", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter & Search Logic
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(enq => {
      const d = enq.createdAt 
        ? (enq.createdAt.toDate ? enq.createdAt.toDate() : new Date(enq.createdAt)) 
        : new Date();
      const dateString = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toLowerCase();
      
      const matchesSearch = 
        (enq.studentName || enq.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enq.mobile || enq.phone || '').includes(searchTerm) ||
        (enq.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        dateString.includes(searchTerm.toLowerCase());
      
      const enqStatus = (enq.status || 'New').toLowerCase();
      const matchesStatus = statusFilter === 'All' ? true : enqStatus === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [enquiries, searchTerm, statusFilter]);

  // Status Cards Logic
  const stats = useMemo(() => {
    let newC = 0, contacted = 0, interested = 0, resolved = 0;
    enquiries.forEach(e => {
      const s = (e.status || 'New').toLowerCase();
      if (s === 'new') newC++;
      if (s === 'contacted') contacted++;
      if (s === 'interested') interested++;
      if (s === 'resolved') resolved++;
    });
    return { total: enquiries.length, new: newC, contacted, interested, resolved };
  }, [enquiries]);

  // Actions
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'enquiries', id), { status: newStatus });
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'enquiries', id));
        setIsViewModalOpen(false);
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete enquiry.");
      }
    }
  };

  const openWhatsApp = (phone) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    // If indian number without country code, add 91
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${finalPhone}`, '_blank');
  };

  // Table Columns
  const columns = [
    { header: "Name", accessor: "name", render: (row) => <span className="font-semibold text-gray-900">{row.studentName || row.name || 'N/A'}</span> },
    { header: "Contact", accessor: "contact", render: (row) => (
      <div className="flex flex-col text-xs">
        <span>{row.mobile || row.phone}</span>
        <span className="text-gray-400">{row.email}</span>
      </div>
    )},
    { header: "Course", accessor: "course", render: (row) => (
      <span className="bg-military-green/10 text-military-green px-2 py-1 rounded-sm text-[10px] font-medium uppercase tracking-wider border border-military-green/20">
        {row.selectedCourse || row.course || 'General'}
      </span>
    )},
    { header: "Date", accessor: "date", render: (row) => {
      const d = row.createdAt 
        ? (row.createdAt.toDate ? row.createdAt.toDate() : new Date(row.createdAt)) 
        : new Date();
      return <span className="text-gray-500">{d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
    }},
    { header: "Status", accessor: "status", render: (row) => {
      const s = row.status || 'New';
      let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
      if (s.toLowerCase() === 'new') colorClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
      if (s.toLowerCase() === 'contacted') colorClass = "bg-blue-50 text-blue-700 border-blue-200";
      if (s.toLowerCase() === 'interested') colorClass = "bg-purple-50 text-purple-700 border-purple-200";
      if (s.toLowerCase() === 'resolved') colorClass = "bg-green-50 text-green-700 border-green-200";
      if (s.toLowerCase() === 'rejected') colorClass = "bg-red-50 text-red-700 border-red-200";

      return (
        <select 
          value={s}
          onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
          onClick={(e) => e.stopPropagation()} // Prevent row click
          className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${colorClass}`}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Follow Up">Follow Up</option>
          <option value="Interested">Interested</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      );
    }},
    { header: "Actions", accessor: "actions", render: (row) => (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setSelectedEnquiry(row); setIsViewModalOpen(true); }} className="p-1. text-gray-600 hover:bg-gray-100 rounded-sm transition-colors" title="View">
          <Eye className="w-4 h-4" />
        </button>
        <button onClick={() => openWhatsApp(row.mobile || row.phone)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-colors" title="WhatsApp">
          <MessageSquare className="w-4 h-4" />
        </button>
        <a href={`tel:${row.mobile || row.phone}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="Call">
          <Phone className="w-4 h-4" />
        </a>
      </div>
    )}
  ];

  return (
    <>
      <AdminPageHeader 
        title="Enquiry Management" 
        subtitle="Track, filter, and respond to admission enquiries."
        searchPlaceholder="Search by name, phone or email..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={[
          { label: "All Status", value: "All" },
          { label: "New", value: "New" },
          { label: "Contacted", value: "Contacted" },
          { label: "Interested", value: "Interested" },
          { label: "Resolved", value: "Resolved" }
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-gray-700" },
          { label: "New", value: stats.new, color: "text-yellow-600" },
          { label: "Contacted", value: stats.contacted, color: "text-blue-600" },
          { label: "Interested", value: stats.interested, color: "text-purple-600" },
          { label: "Resolved", value: stats.resolved, color: "text-green-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm text-center">
            <h4 className={`text-2xl font-bebas tracking-wider ${s.color}`}>{s.value}</h4>
            <p className="text-[10px] font-oswald uppercase tracking-wider text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminTable 
        columns={columns} 
        data={filteredEnquiries} 
        loading={loading}
        onRowClick={(row) => {
          setSelectedEnquiry(row);
          setIsViewModalOpen(true);
        }}
      />

      {/* View Enquiry Modal */}
      <AdminModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        title="Enquiry Details"
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
              <h4 className="font-bebas text-xl text-military-green mb-4 border-b border-gray-200 pb-2">Student Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs font-oswald uppercase tracking-wider">Full Name</p>
                  <p className="font-semibold text-gray-900">{selectedEnquiry.studentName || selectedEnquiry.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-oswald uppercase tracking-wider">Target Course</p>
                  <p className="font-semibold text-gray-900">{selectedEnquiry.selectedCourse || selectedEnquiry.course || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-oswald uppercase tracking-wider">Phone Number</p>
                  <a href={`tel:${selectedEnquiry.mobile || selectedEnquiry.phone}`} className="font-semibold text-blue-600 hover:underline">
                    {selectedEnquiry.mobile || selectedEnquiry.phone || 'N/A'}
                  </a>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-oswald uppercase tracking-wider">Email Address</p>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-blue-600 hover:underline break-all">
                    {selectedEnquiry.email || 'N/A'}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bebas text-xl text-military-green mb-2">Message</h4>
              <p className="text-sm text-gray-700 bg-white border border-gray-200 p-4 rounded-sm whitespace-pre-wrap">
                {selectedEnquiry.message || 'No additional message provided.'}
              </p>
            </div>

            <div>
              <h4 className="font-bebas text-xl text-military-green mb-2">Admin Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => openWhatsApp(selectedEnquiry.mobile || selectedEnquiry.phone)} className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-inter rounded-sm transition-colors">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </button>
                <a href={`mailto:${selectedEnquiry.email}`} className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-inter rounded-sm transition-colors">
                  <Mail className="w-4 h-4" /> Email
                </a>
                <a href={`tel:${selectedEnquiry.mobile || selectedEnquiry.phone}`} className="flex items-center gap-1.5 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs font-inter rounded-sm transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </a>
                
                <div className="ml-auto">
                  <button onClick={() => handleDelete(selectedEnquiry.id)} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-inter rounded-sm transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
};

export default Enquiries;
