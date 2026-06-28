import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'admins';

export const adminService = {
  // Get all admins
  getAllAdmins: async () => {
    const q = query(collection(db, COLLECTION));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get admin by ID
  getAdminById: async (id) => {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  // Create admin profile (usually after Auth signup)
  createAdminProfile: async (uid, data) => {
    const docRef = doc(db, COLLECTION, uid);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      role: data.role || 'admin'
    });
  },

  // Update admin
  updateAdmin: async (id, data) => {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  // Update last login
  updateLastLogin: async (uid) => {
    const docRef = doc(db, COLLECTION, uid);
    await updateDoc(docRef, {
      lastLogin: serverTimestamp()
    });
  },

  // Delete admin
  deleteAdmin: async (id) => {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  }
};
