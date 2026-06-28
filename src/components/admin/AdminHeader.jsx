import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const mobileTabs = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Enquiries', path: '/admin/enquiries' },
    { name: 'Admissions', path: '/admin/admissions' },
    { name: 'Students', path: '/admin/students' },
    { name: 'Fees', path: '/admin/fees' },
    { name: 'Courses', path: '/admin/manage-courses' }
  ];

  return (
    <div className="md:hidden bg-military-green text-white flex flex-col gap-3 shadow-md w-full z-20">
      <div className="p-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-premium-gold" />
          <h2 className="font-bebas text-2xl tracking-wider text-white">VDA Admin</h2>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-sm font-oswald uppercase tracking-wider text-xs transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>
      
      {/* Mobile Tab pills */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 no-scrollbar scrollbar-none">
        {mobileTabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-4 py-2 text-xs font-oswald uppercase tracking-wider rounded-sm whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-premium-gold text-black font-semibold' 
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHeader;
