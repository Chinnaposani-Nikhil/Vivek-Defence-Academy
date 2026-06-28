import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Save, Building2, Shield, Settings2, Globe, Phone, Mail, MapPin } from 'lucide-react';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('academy');

  // Academy Info State
  const [academyInfo, setAcademyInfo] = useState({
    name: 'Vivek Defence Academy',
    email: 'info@vivekdefenceacademy.com',
    phone: '+91 99999 99999',
    whatsapp: '+91 99999 99999',
    address: '123 Defense Road, Cantonment Area',
    facebook: '',
    instagram: '',
    youtube: '',
    mapEmbedUrl: ''
  });

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: currentUser?.email || ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAcademyInfo({ ...academyInfo, ...docSnap.data().academyInfo });
        }
        
        if (currentUser) {
          const adminRef = doc(db, 'admins', currentUser.uid);
          const adminSnap = await getDoc(adminRef);
          if (adminSnap.exists()) {
            setAdminProfile({ ...adminProfile, ...adminSnap.data() });
          }
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchSettings();
  }, [currentUser]);

  const handleSaveAcademyInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), { academyInfo }, { merge: true });
      alert("Academy information saved successfully!");
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdminProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentUser) {
        await updateDoc(doc(db, 'admins', currentUser.uid), {
          name: adminProfile.name
        });
        alert("Admin profile updated successfully!");
      }
    } catch (err) {
      console.error("Failed to save admin profile", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="font-bebas text-3xl text-military-green tracking-wider">System Settings</h2>
        <p className="text-sm font-inter text-gray-500">Manage global academy configurations and admin profiles.</p>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-200 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <button onClick={() => setActiveTab('academy')} className={`flex items-center gap-3 px-5 py-4 text-sm font-oswald uppercase tracking-wider transition-colors border-b border-gray-200 ${activeTab === 'academy' ? 'bg-white text-military-green border-r-4 border-r-military-green' : 'text-gray-600 hover:bg-gray-100 border-r-4 border-r-transparent'}`}>
            <Building2 className="w-4 h-4" /> Academy Info
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 px-5 py-4 text-sm font-oswald uppercase tracking-wider transition-colors border-b border-gray-200 ${activeTab === 'profile' ? 'bg-white text-military-green border-r-4 border-r-military-green' : 'text-gray-600 hover:bg-gray-100 border-r-4 border-r-transparent'}`}>
            <Shield className="w-4 h-4" /> Admin Profile
          </button>
          <button onClick={() => setActiveTab('system')} className={`flex items-center gap-3 px-5 py-4 text-sm font-oswald uppercase tracking-wider transition-colors border-b border-gray-200 ${activeTab === 'system' ? 'bg-white text-military-green border-r-4 border-r-military-green' : 'text-gray-600 hover:bg-gray-100 border-r-4 border-r-transparent'}`}>
            <Settings2 className="w-4 h-4" /> System Config
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
          
          {/* Academy Info Tab */}
          {activeTab === 'academy' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-bebas text-2xl tracking-wider text-gray-900 mb-6 border-b border-gray-100 pb-4">Academy Details</h3>
              <form onSubmit={handleSaveAcademyInfo} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Academy Name</label>
                    <input type="text" required value={academyInfo.name} onChange={e => setAcademyInfo({...academyInfo, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Official Email <Mail className="w-3 h-3 inline ml-1"/></label>
                    <input type="email" required value={academyInfo.email} onChange={e => setAcademyInfo({...academyInfo, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Contact Phone <Phone className="w-3 h-3 inline ml-1"/></label>
                    <input type="text" required value={academyInfo.phone} onChange={e => setAcademyInfo({...academyInfo, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">WhatsApp Number</label>
                    <input type="text" required value={academyInfo.whatsapp} onChange={e => setAcademyInfo({...academyInfo, whatsapp: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Full Address <MapPin className="w-3 h-3 inline ml-1"/></label>
                    <textarea required value={academyInfo.address} onChange={e => setAcademyInfo({...academyInfo, address: e.target.value})} rows="2" className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm resize-none"></textarea>
                  </div>
                </div>

                <h4 className="font-bebas text-xl tracking-wider text-gray-800 mt-8 mb-4 border-b border-gray-100 pb-2">Social Links & Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Facebook URL</label>
                    <input type="url" value={academyInfo.facebook} onChange={e => setAcademyInfo({...academyInfo, facebook: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Instagram URL</label>
                    <input type="url" value={academyInfo.instagram} onChange={e => setAcademyInfo({...academyInfo, instagram: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">YouTube URL</label>
                    <input type="url" value={academyInfo.youtube} onChange={e => setAcademyInfo({...academyInfo, youtube: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Google Maps Embed URL</label>
                    <input type="text" value={academyInfo.mapEmbedUrl} onChange={e => setAcademyInfo({...academyInfo, mapEmbedUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-military-green hover:bg-army-olive text-white rounded-sm font-oswald uppercase tracking-wider transition-colors disabled:opacity-50">
                    <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Academy Info'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Admin Profile Tab */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-bebas text-2xl tracking-wider text-gray-900 mb-6 border-b border-gray-100 pb-4">Administrator Profile</h3>
              
              <div className="max-w-md">
                <form onSubmit={handleSaveAdminProfile} className="space-y-5 mb-10">
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Admin Name</label>
                    <input type="text" value={adminProfile.name} onChange={e => setAdminProfile({...adminProfile, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:border-military-green outline-none font-inter text-sm" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider text-gray-600 mb-1">Login Email (Read Only)</label>
                    <input type="email" readOnly value={adminProfile.email} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-sm outline-none font-inter text-sm text-gray-500 cursor-not-allowed" />
                  </div>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-military-green hover:bg-army-olive text-white rounded-sm font-oswald uppercase tracking-wider transition-colors disabled:opacity-50">
                    Update Profile
                  </button>
                </form>

                <div className="p-5 bg-red-50 border border-red-100 rounded-sm">
                  <h4 className="font-bebas text-xl text-red-700 tracking-wider mb-2">Danger Zone</h4>
                  <p className="text-sm font-inter text-red-600/80 mb-4">Logging out will clear your current session.</p>
                  <button onClick={logout} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm font-oswald uppercase tracking-wider transition-colors">
                    Logout Immediately
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* System Config Tab */}
          {activeTab === 'system' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-bebas text-2xl tracking-wider text-gray-900 mb-6 border-b border-gray-100 pb-4">System Configuration</h3>
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-sm flex items-center justify-between bg-gray-50">
                  <div>
                    <h5 className="font-bold text-gray-900 font-inter">Maintenance Mode</h5>
                    <p className="text-sm text-gray-500 font-inter mt-1">Take the public website offline for updates.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-military-green opacity-50 cursor-not-allowed"></div>
                  </label>
                </div>

                <div className="p-6 border border-gray-200 rounded-sm flex items-center justify-between bg-gray-50">
                  <div>
                    <h5 className="font-bold text-gray-900 font-inter">Auto-Backup Database</h5>
                    <p className="text-sm text-gray-500 font-inter mt-1">Automatically backup Firestore database daily.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" disabled checked />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-military-green opacity-50 cursor-not-allowed"></div>
                  </label>
                </div>
                
                <p className="text-xs text-gray-400 italic text-center mt-8">System configurations are currently managed by the Development Team.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
