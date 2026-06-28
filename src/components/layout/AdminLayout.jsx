import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminHeader from '../admin/AdminHeader';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not logged in or not admin, redirect to login
    // BUT only if we are fully initialized (auth context handles loading)
    if (!currentUser || !isAdmin) {
      navigate('/admin');
    }
  }, [currentUser, isAdmin, navigate]);

  if (!currentUser || !isAdmin) {
    return null; // Or a loading spinner
  }

  // A helper to format the route path into a title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('enquiries')) return 'Enquiries';
    if (path.includes('admissions')) return 'Admissions';
    if (path.includes('students')) return 'Students';
    if (path.includes('fees')) return 'Fees';
    if (path.includes('manage-courses')) return 'Manage Courses';
    if (path.includes('gallery')) return 'Gallery';
    if (path.includes('faculty')) return 'Faculty';
    if (path.includes('testimonials')) return 'Testimonials';
    if (path.includes('notifications')) return 'Notifications';
    if (path.includes('settings')) return 'Settings';
    return 'Admin Portal';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row w-full overflow-hidden">
      {/* Mobile Top Navigation Header */}
      <AdminHeader />

      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full h-screen">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h1 className="font-bebas text-4xl text-gray-800 tracking-wider">{getPageTitle()}</h1>
          <div className="text-sm text-gray-500 font-inter">
            Logged in as <span className="font-bold text-military-green">{currentUser?.email}</span>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="md:hidden flex items-center mb-6 mt-2">
          <h1 className="font-bebas text-3xl text-gray-800 tracking-wider">{getPageTitle()}</h1>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
