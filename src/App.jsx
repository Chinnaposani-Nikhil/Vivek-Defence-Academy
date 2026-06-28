import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

// Public Layout
import MainLayout from './components/layout/MainLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import Faculty from './pages/Faculty';
import SuccessStories from './pages/SuccessStories';
import Contact from './pages/Contact';
import Admission from './pages/Admission';

// Admin Layout & Pages
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/admin/Login';
import Signup from './pages/admin/Signup';
import ForgotPassword from './pages/admin/ForgotPassword';
import Dashboard from './pages/admin/Dashboard';
import Enquiries from './pages/admin/Enquiries';
import Admissions from './pages/admin/Admissions';
import Students from './pages/admin/Students';
import Fees from './pages/admin/Fees';
import ManageCourses from './pages/admin/ManageCourses';
import GalleryAdmin from './pages/admin/Gallery';
import FacultyAdmin from './pages/admin/Faculty';
import TestimonialsAdmin from './pages/admin/Testimonials';
import NotificationsAdmin from './pages/admin/Notifications';
import Settings from './pages/admin/Settings';

import FloatingWhatsApp from './components/ui/FloatingWhatsApp';
import ScrollProgress from './components/ui/ScrollProgress';

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="courses" element={<Courses />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="faculty" element={<Faculty />} />
                <Route path="success-stories" element={<SuccessStories />} />
                <Route path="contact" element={<Contact />} />
                <Route path="admission" element={<Admission />} />
              </Route>

              {/* Admin Auth Routes */}
              <Route path="/admin">
                <Route index element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="enquiries" element={<Enquiries />} />
                <Route path="admissions" element={<Admissions />} />
                <Route path="students" element={<Students />} />
                <Route path="fees" element={<Fees />} />
                <Route path="manage-courses" element={<ManageCourses />} />
                <Route path="gallery" element={<GalleryAdmin />} />
                <Route path="faculty" element={<FacultyAdmin />} />
                <Route path="testimonials" element={<TestimonialsAdmin />} />
                <Route path="notifications" element={<NotificationsAdmin />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
            <FloatingWhatsApp />
            <ScrollProgress />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
