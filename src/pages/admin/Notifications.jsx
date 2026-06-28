import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import { Send, Bell, Trash2, Megaphone, AlertTriangle, IndianRupee, BookOpen, Clock } from 'lucide-react';

const COURSES = ['Army (GD)', 'Navy', 'Air Force', 'Police (SI/Constable)', 'SSC GD', 'Agniveer', 'Physical Training'];
const NOTIFICATION_TYPES = ['Announcement', 'Emergency Notice', 'Fee Reminder', 'Course Update', 'Admission Update'];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Announcement');
  const [recipientType, setRecipientType] = useState('All Students');
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        title,
        message,
        type,
        recipientType,
        targetCourse: recipientType === 'Selected Course' ? selectedCourse : null,
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setTitle('');
      setMessage('');
      alert("Notification sent successfully!");
    } catch (err) {
      console.error("Failed to send notification", err);
      alert("Failed to send notification.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this notification history?")) {
      await deleteDoc(doc(db, 'notifications', id));
    }
  };

  const getTypeIcon = (nType) => {
    switch(nType) {
      case 'Emergency Notice': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Fee Reminder': return <IndianRupee className="w-5 h-5 text-yellow-500" />;
      case 'Course Update': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'Announcement':
      default: return <Megaphone className="w-5 h-5 text-military-green" />;
    }
  };

  return (
    <>
      <AdminPageHeader 
        title="Notification Center" 
        subtitle="Push announcements, reminders, and updates to students."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Send Notification Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
            <h4 className="font-bebas text-2xl text-military-green tracking-wider mb-5 flex items-center gap-2">
              <Send className="w-5 h-5" /> Compose Message
            </h4>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Notification Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white font-inter text-sm">
                  {NOTIFICATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Recipients</label>
                <select value={recipientType} onChange={e => setRecipientType(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none bg-white font-inter text-sm mb-2">
                  <option value="All Students">All Students</option>
                  <option value="Selected Course">Students in Specific Course</option>
                </select>
                
                {recipientType === 'Selected Course' && (
                  <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full px-3 py-2 border border-military-green/50 bg-military-green/5 rounded-sm focus:border-military-green outline-none font-inter text-sm">
                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Message Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Important Exam Update"
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm font-semibold" 
                />
              </div>

              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Detailed Message</label>
                <textarea 
                  rows="4" 
                  required 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  placeholder="Type your message here..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSending}
                className="w-full py-3 bg-military-green hover:bg-army-olive text-white rounded-sm font-oswald uppercase tracking-wider transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSending ? 'Sending...' : <><Send className="w-4 h-4" /> Push Notification</>}
              </button>
            </form>
          </div>
        </div>

        {/* Notification History */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 h-[calc(100vh-200px)] flex flex-col">
            <h4 className="font-bebas text-2xl text-gray-800 tracking-wider mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Sent History
            </h4>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500 font-inter">Loading history...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <Bell className="w-12 h-12 text-gray-200 mb-3" />
                  <p className="text-gray-500 font-inter">No notifications sent yet.</p>
                </div>
              ) : (
                notifications.map(n => {
                  const d = n.createdAt?.toDate ? n.createdAt.toDate() : new Date();
                  return (
                    <div key={n.id} className="p-4 border border-gray-100 rounded-sm hover:border-gray-300 transition-colors bg-gray-50/50 group relative">
                      <div className="flex items-start gap-3">
                        <div className="pt-1">{getTypeIcon(n.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-bold text-gray-900 font-inter">{n.title}</h5>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                          </div>
                          <div className="flex gap-2 mb-2">
                            <span className="text-[10px] uppercase font-oswald tracking-wider bg-white border border-gray-200 px-2 py-0.5 rounded-sm text-gray-600">{n.type}</span>
                            <span className="text-[10px] uppercase font-oswald tracking-wider bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-sm text-blue-700">
                              To: {n.recipientType === 'Selected Course' ? n.targetCourse : 'All Students'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-inter whitespace-pre-wrap">{n.message}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(n.id)}
                        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Notifications;
