import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Users, FileText, Image as ImageIcon, MessageSquare, ShieldCheck, LayoutDashboard, Settings, UserCheck, GraduationCap, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
  { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare className="w-4 h-4 shrink-0" /> },
  { name: 'Admissions', path: '/admin/admissions', icon: <UserCheck className="w-4 h-4 shrink-0" /> },
  { name: 'Students', path: '/admin/students', icon: <Users className="w-4 h-4 shrink-0" /> },
  { name: 'Fees', path: '/admin/fees', icon: <CreditCard className="w-4 h-4 shrink-0" /> },
  { name: 'Courses', path: '/admin/manage-courses', icon: <FileText className="w-4 h-4 shrink-0" /> },
  { name: 'Faculty', path: '/admin/faculty', icon: <GraduationCap className="w-4 h-4 shrink-0" /> },
  { name: 'Gallery', path: '/admin/gallery', icon: <ImageIcon className="w-4 h-4 shrink-0" /> },
  { name: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquare className="w-4 h-4 shrink-0" /> },
  { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4 shrink-0" /> },
  { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4 shrink-0" /> },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className="w-64 bg-military-green text-white hidden md:flex flex-col shrink-0 min-h-screen">
      <div className="p-6 border-b border-white/10 flex items-center gap-2.5 shrink-0">
        <ShieldCheck className="w-8 h-8 text-premium-gold" />
        <div className="flex flex-col">
          <h2 className="font-bebas text-2xl tracking-wider leading-none">VDA Admin</h2>
          <span className="text-[9px] uppercase tracking-[0.2em] text-saffron font-bold">Portal</span>
        </div>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <ul className="space-y-1.5 px-4 font-oswald uppercase tracking-wider text-sm">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`p-3 rounded-sm transition-colors flex items-center gap-3 ${
                    isActive 
                      ? 'bg-white/15 text-premium-gold border-l-2 border-premium-gold' 
                      : 'hover:bg-white/5 text-gray-200'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10 shrink-0 bg-military-green mt-auto">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-2 text-sm font-oswald uppercase tracking-widest bg-red-800 hover:bg-red-700 py-2.5 rounded-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
