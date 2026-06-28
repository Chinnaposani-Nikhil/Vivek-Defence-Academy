import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const dashboardService = {
  getAnalyticsSummary: async () => {
    try {
      // Basic counts (In a production app with huge data, use aggregation queries, but this works for standard load)
      const studentsSnap = await getDocs(collection(db, 'students'));
      const enquiriesSnap = await getDocs(collection(db, 'enquiries'));
      const coursesSnap = await getDocs(collection(db, 'courses'));
      
      const totalStudents = studentsSnap.size;
      const totalEnquiries = enquiriesSnap.size;
      const activeCourses = coursesSnap.size;
      
      let pendingEnquiries = 0;
      enquiriesSnap.forEach(doc => {
        if (doc.data().status === 'new' || doc.data().status === 'New') {
          pendingEnquiries++;
        }
      });
      
      return {
        totalStudents,
        totalEnquiries,
        activeCourses,
        pendingEnquiries
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { totalStudents: 0, totalEnquiries: 0, activeCourses: 0, pendingEnquiries: 0 };
    }
  }
};
