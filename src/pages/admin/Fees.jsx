import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminTable from '../../components/admin/ui/AdminTable';
import AdminModal from '../../components/admin/ui/AdminModal';
import { IndianRupee, History, Receipt, AlertCircle } from 'lucide-react';

const COURSES = ['Army (GD)', 'Navy', 'Air Force', 'Police (SI/Constable)', 'SSC GD', 'Agniveer', 'Physical Training'];

const Fees = () => {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  
  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentRemarks, setPaymentRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time listener for students
  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for payments
  useEffect(() => {
    const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(data);
    });
    return () => unsubscribe();
  }, []);

  // Filtering
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = 
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.studentId || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = courseFilter === 'All' ? true : s.course === courseFilter;
      // Also filter out completely inactive students if they have no pending fees? 
      // For now, show all.
      return matchesSearch && matchesCourse;
    });
  }, [students, searchTerm, courseFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totals = { Total: 0, Collected: 0, Pending: 0 };
    students.forEach(s => {
      totals.Total += Number(s.feeAmount || 0);
      totals.Collected += Number(s.paidFee || 0);
      totals.Pending += Number(s.pendingFee || 0);
    });
    return totals;
  }, [students]);

  // Handle Receive Payment
  const handleReceivePayment = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !paymentAmount || isNaN(paymentAmount)) return;
    
    setIsSubmitting(true);
    const amount = Number(paymentAmount);
    
    try {
      // 1. Record the payment in 'payments' collection
      await addDoc(collection(db, 'payments'), {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        course: selectedStudent.course,
        amount: amount,
        mode: paymentMode,
        remarks: paymentRemarks,
        createdAt: serverTimestamp()
      });

      // 2. Update the student's fee record
      const newPaid = Number(selectedStudent.paidFee || 0) + amount;
      const newPending = Number(selectedStudent.feeAmount || 0) - newPaid;
      
      await updateDoc(doc(db, 'students', selectedStudent.id), {
        paidFee: newPaid,
        pendingFee: newPending,
        updatedAt: serverTimestamp()
      });

      setIsPaymentModalOpen(false);
      setPaymentAmount('');
      setPaymentRemarks('');
      setPaymentMode('Cash');
      alert("Payment recorded successfully!");
    } catch (err) {
      console.error("Failed to record payment", err);
      alert("Failed to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: "Student", accessor: "name", render: (row) => (
      <div>
        <div className="font-semibold text-gray-900">{row.name}</div>
        <div className="text-[10px] font-oswald text-gray-500 tracking-wider">ID: {row.studentId || 'N/A'}</div>
      </div>
    )},
    { header: "Course", accessor: "course", render: (row) => <span className="bg-military-green/10 text-military-green px-2 py-1 rounded-sm text-[10px] font-medium uppercase tracking-wider">{row.course}</span> },
    { header: "Total Fee", accessor: "totalFee", render: (row) => <span className="font-medium text-gray-900">₹{row.feeAmount || 0}</span> },
    { header: "Paid", accessor: "paidFee", render: (row) => <span className="font-medium text-green-600">₹{row.paidFee || 0}</span> },
    { header: "Pending", accessor: "pendingFee", render: (row) => {
      const pending = row.pendingFee || 0;
      return <span className={`font-medium ${pending > 0 ? 'text-red-600' : 'text-gray-500'}`}>₹{pending}</span>
    }},
    { header: "Status", accessor: "status", render: (row) => {
      const pending = row.pendingFee || 0;
      if (pending > 0) return <span className="px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-700 border border-yellow-200">Due</span>;
      return <span className="px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">Cleared</span>;
    }},
    { header: "Actions", accessor: "actions", render: (row) => (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        {row.pendingFee > 0 && (
          <button onClick={() => { setSelectedStudent(row); setIsPaymentModalOpen(true); }} className="flex items-center gap-1 px-2 py-1 bg-military-green text-white hover:bg-army-olive rounded-sm transition-colors text-[10px] uppercase font-oswald tracking-wider" title="Receive Payment">
            <IndianRupee className="w-3 h-3" /> Receive
          </button>
        )}
        <button onClick={() => { setSelectedStudent(row); setIsHistoryModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="Payment History">
          <History className="w-4 h-4" />
        </button>
      </div>
    )}
  ];

  return (
    <>
      <AdminPageHeader 
        title="Fee Management" 
        subtitle="Track student fees, receive payments, and view history."
        searchPlaceholder="Search students..."
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Expected Fees", value: stats.Total, color: "text-gray-900" },
          { label: "Total Collected Fees", value: stats.Collected, color: "text-green-600" },
          { label: "Total Pending Fees", value: stats.Pending, color: "text-red-600" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-center">
            <p className="text-xs font-oswald uppercase tracking-wider text-gray-500 mb-1">{s.label}</p>
            <h4 className={`text-3xl font-bebas tracking-wider ${s.color}`}>₹{s.value.toLocaleString('en-IN')}</h4>
          </div>
        ))}
      </div>

      <AdminTable 
        columns={columns} 
        data={filteredStudents} 
        loading={loading}
      />

      {/* Receive Payment Modal */}
      <AdminModal isOpen={isPaymentModalOpen} onClose={() => !isSubmitting && setIsPaymentModalOpen(false)} title="Receive Payment">
        {selectedStudent && (
          <form onSubmit={handleReceivePayment} className="space-y-4 font-inter text-sm">
            <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 mb-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                <p className="text-xs text-gray-500">{selectedStudent.course}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-oswald uppercase tracking-wider text-gray-500">Pending Amount</p>
                <p className="font-bebas text-xl text-red-600 tracking-wider">₹{selectedStudent.pendingFee || 0}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Amount Receiving (₹)</label>
              <input 
                type="number" 
                required 
                max={selectedStudent.pendingFee || 0}
                value={paymentAmount} 
                onChange={e => setPaymentAmount(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none text-lg font-semibold text-gray-900" 
              />
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Payment Mode</label>
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / QR</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Credit/Debit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Remarks (Optional)</label>
              <input type="text" value={paymentRemarks} onChange={e => setPaymentRemarks(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none" placeholder="e.g. Transaction ID, Check No." />
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-sm text-sm font-oswald uppercase tracking-wider transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-military-green hover:bg-army-olive text-white rounded-sm text-sm font-oswald uppercase tracking-wider transition-colors disabled:opacity-50">
                {isSubmitting ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Payment History Modal */}
      <AdminModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title="Payment History" maxWidth="max-w-2xl">
        {selectedStudent && (
          <div>
            <div className="flex items-center justify-between bg-military-green/5 border border-military-green/10 p-4 rounded-sm mb-6">
              <div>
                <h4 className="font-bebas text-2xl tracking-wider text-military-green">{selectedStudent.name}</h4>
                <p className="text-sm font-inter text-gray-600">{selectedStudent.course}</p>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-oswald uppercase tracking-wider text-gray-500">Total Paid</span>
                <span className="font-bebas text-2xl text-green-600 tracking-wider">₹{selectedStudent.paidFee || 0}</span>
              </div>
            </div>

            <div className="space-y-3">
              {payments.filter(p => p.studentId === selectedStudent.id).length === 0 ? (
                <div className="text-center p-8 border border-dashed border-gray-200 rounded-sm text-gray-500 text-sm font-inter">
                  <Receipt className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  No payment history found for this student.
                </div>
              ) : (
                payments.filter(p => p.studentId === selectedStudent.id).map(p => {
                  const d = p.createdAt?.toDate ? p.createdAt.toDate() : new Date();
                  return (
                    <div key={p.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-sm bg-white hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-sm bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100">
                          <IndianRupee className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                          <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded-sm">{p.mode}</span>
                            {p.remarks && <span>• {p.remarks}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bebas text-xl text-gray-900 tracking-wider">+ ₹{p.amount}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
};

export default Fees;
