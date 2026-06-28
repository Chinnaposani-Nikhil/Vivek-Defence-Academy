import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'courses';

export const courseService = {
  getAllCourses: async () => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  addCourse: async (data) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },
  updateCourse: async (id, data) => {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },
  deleteCourse: async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  }
};
