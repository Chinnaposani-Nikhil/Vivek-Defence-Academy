import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminTable from '../../components/admin/ui/AdminTable';
import AdminModal from '../../components/admin/ui/AdminModal';
import { UserCheck, XCircle, Trash2, Edit, Eye, Download } from 'lucide-react';

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'admissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmissions(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching admissions: ", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtering
  const filteredAdmissions = useMemo(() => {
    return admissions.filter(a => {
      const matchesSearch = 
        (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.phone || '').includes(searchTerm);
      const matchesStatus = statusFilter === 'All' ? true : a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [admissions, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const counts = { Pending: 0, Approved: 0, Rejected: 0, Completed: 0 };
    admissions.forEach(a => {
      if (a.status === 'Pending') counts.Pending++;
      if (a.status === 'Approved') counts.Approved++;
      if (a.status === 'Rejected') counts.Rejected++;
      if (a.status === 'Completed') counts.Completed++;
    });
    return counts;
  }, [admissions]);

  // Actions
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'admissions', id), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      if (selectedAdmission && selectedAdmission.id === id) {
        setSelectedAdmission({ ...selectedAdmission, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status.");
    }
  };

  const handleApproveToStudent = async (admission) => {
    if (window.confirm("Approve this admission and add to Students?")) {
      try {
        // 1. Add to students collection
        await addDoc(collection(db, 'students'), {
          name: admission.name || '',
          phone: admission.phone || '',
          email: admission.email || '',
          course: admission.course || '',
          status: 'Active',
          feeAmount: admission.feeAmount || 0,
          paidFee: admission.paidFee || 0,
          pendingFee: (admission.feeAmount || 0) - (admission.paidFee || 0),
          joiningDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // 2. Update admission status
        await handleUpdateStatus(admission.id, 'Approved');
        setIsViewModalOpen(false);
        alert("Student successfully enrolled!");
      } catch (err) {
        console.error("Failed to convert to student", err);
        alert("Failed to enroll student.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this admission record?")) {
      try {
        await deleteDoc(doc(db, 'admissions', id));
        setIsViewModalOpen(false);
      } catch (err) {
        console.error("Failed to delete", err);
        alert("Failed to delete admission.");
      }
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Phone,Course,Status\n"
      + filteredAdmissions.map(a => `${a.name},${a.phone},${a.course},${a.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { header: "Name", accessor: "name", render: (row) => <span className="font-semibold text-gray-900">{row.name || 'N/A'}</span> },
    { header: "Contact", accessor: "contact", render: (row) => <span className="text-gray-600">{row.phone}</span> },
    { header: "Course", accessor: "course", render: (row) => <span className="bg-military-green/10 text-military-green px-2 py-1 rounded-sm text-[10px] font-medium uppercase tracking-wider">{row.course || 'General'}</span> },
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
      if (s === 'Completed') colorClass = "bg-blue-50 text-blue-700 border-blue-200";

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
          <option value="Completed">Completed</option>
        </select>
      );
    }},
    { header: "Actions", accessor: "actions", render: (row) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setSelectedAdmission(row); setIsViewModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="View"><Eye className="w-4 h-4" /></button>
        {row.status === 'Pending' && (
          <>
            <button onClick={() => handleApproveToStudent(row)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-colors" title="Approve & Enroll"><UserCheck className="w-4 h-4" /></button>
            <button onClick={() => handleUpdateStatus(row.id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
          </>
        )}
        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 rounded-sm transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <>
      <AdminPageHeader 
        title="Admission Requests" 
        subtitle="Review and approve new admission applications."
        actionText="Export CSV"
        onAction={exportData}
        searchPlaceholder="Search applicants..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={[
          { label: "All Status", value: "All" },
          { label: "Pending", value: "Pending" },
          { label: "Approved", value: "Approved" },
          { label: "Rejected", value: "Rejected" },
          { label: "Completed", value: "Completed" }
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pending", value: stats.Pending, color: "text-yellow-600" },
          { label: "Approved", value: stats.Approved, color: "text-green-600" },
          { label: "Rejected", value: stats.Rejected, color: "text-red-600" },
          { label: "Completed", value: stats.Completed, color: "text-blue-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm text-center">
            <h4 className={`text-2xl font-bebas tracking-wider ${s.color}`}>{s.value}</h4>
            <p className="text-[10px] font-oswald uppercase tracking-wider text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminTable 
        columns={columns} 
        data={filteredAdmissions} 
        loading={loading}
        onRowClick={(row) => { setSelectedAdmission(row); setIsViewModalOpen(true); }}
      />

      {/* View Modal */}
      <AdminModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Admission Details" maxWidth="max-w-xl">
        {selectedAdmission && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-2">
                <h4 className="font-bebas text-xl text-military-green">Applicant Information</h4>
                <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                  selectedAdmission.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                  selectedAdmission.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                  selectedAdmission.status === 'Completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {selectedAdmission.status || 'Pending'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm font-inter">
                <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Name:</span> <br/><span className="font-semibold">{selectedAdmission.name || 'N/A'}</span></div>
                <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Course:</span> <br/><span className="font-semibold">{selectedAdmission.course || 'N/A'}</span></div>
                <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Phone:</span> <br/>{selectedAdmission.phone || 'N/A'}</div>
                <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Email:</span> <br/>{selectedAdmission.email || 'N/A'}</div>
                <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Father's Name:</span> <br/>{selectedAdmission.fathersName || 'N/A'}</div>
                <div><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">DOB:</span> <br/>{selectedAdmission.dob || 'N/A'}</div>
                <div className="col-span-2"><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Education:</span> <br/>{selectedAdmission.education || 'N/A'}</div>
                <div className="col-span-2"><span className="text-gray-500 text-xs uppercase tracking-wider font-oswald">Address:</span> <br/>{selectedAdmission.address || 'N/A'}</div>
              </div>
            </div>

            <div>
              <h4 className="font-bebas text-xl text-military-green mb-2">Actions</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAdmission.status === 'Pending' && (
                  <>
                    <button onClick={() => handleApproveToStudent(selectedAdmission)} className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-inter rounded-sm transition-colors">
                      <UserCheck className="w-4 h-4" /> Approve & Enroll
                    </button>
                    <button onClick={() => handleUpdateStatus(selectedAdmission.id, 'Rejected')} className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-inter rounded-sm transition-colors">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                
                <div className="ml-auto">
                  <button onClick={() => handleDelete(selectedAdmission.id)} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-inter rounded-sm transition-colors">
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

export default Admissions;
