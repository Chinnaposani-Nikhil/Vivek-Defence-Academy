import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { enquiryService } from '../../services/enquiryService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEnquiries: 0,
    activeCourses: 0,
    pendingEnquiries: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summary, enquiries] = await Promise.all([
          dashboardService.getAnalyticsSummary(),
          enquiryService.getAllEnquiries()
        ]);
        
        setStats(summary);
        // Get top 5 recent enquiries
        setRecentEnquiries(enquiries.slice(0, 5));
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { title: "Total Enquiries", value: stats.totalEnquiries, icon: <Users className="text-blue-600 w-6 h-6" /> },
    { title: "Active Courses", value: stats.activeCourses, icon: <FileText className="text-green-600 w-6 h-6" /> },
    { title: "Total Students", value: stats.totalStudents, icon: <Users className="text-purple-600 w-6 h-6" /> },
    { title: "Pending Enquiries", value: stats.pendingEnquiries, icon: <MessageSquare className="text-yellow-600 w-6 h-6" /> }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-military-green"></div></div>;
  }

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-sm shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow duration-300">
            <div>
              <p className="text-xs text-gray-500 font-inter mb-1 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-bebas text-military-green tracking-wider">{stat.value}</h3>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Enquiries Box */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bebas text-2xl text-military-green tracking-wider">Recent Admission Enquiries</h3>
          <Link 
            to="/admin/enquiries"
            className="text-xs font-oswald uppercase tracking-wider text-premium-gold hover:text-military-green bg-military-green hover:bg-premium-gold px-3.5 py-1.5 rounded-sm transition-all duration-300"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-inter text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100 font-oswald uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Mobile</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No enquiries found</td>
                </tr>
              ) : (
                recentEnquiries.map((row, i) => {
                  const dateObj = row.createdAt?.toDate ? row.createdAt.toDate() : new Date();
                  const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                  const isNew = row.status?.toLowerCase() === 'new' || !row.status;

                  return (
                    <tr key={row.id || i} className="hover:bg-gray-50/75 transition-colors">
                      <td className="p-4 font-semibold text-gray-900">{row.studentName || row.name || 'N/A'}</td>
                      <td className="p-4 text-gray-600">{row.mobile || row.phone || 'N/A'}</td>
                      <td className="p-4">
                        <span className="bg-military-green/10 text-military-green px-2.5 py-1 rounded-sm text-xs font-medium uppercase tracking-wider border border-military-green/20">
                          {row.selectedCourse || row.course || 'General'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{dateStr}</td>
                      <td className="p-4">
                        {isNew ? (
                          <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-sm text-xs font-medium uppercase">New</span>
                        ) : (
                          <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-sm text-xs font-medium uppercase">{row.status}</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
