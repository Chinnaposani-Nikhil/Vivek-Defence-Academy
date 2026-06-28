import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'students';

export const studentService = {
  getAllStudents: async () => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getStudentById: async (id) => {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
  },
  addStudent: async (data) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },
  updateStudent: async (id, data) => {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  },
  deleteStudent: async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  }
};
