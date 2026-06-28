import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'feePayments';

export const feeService = {
  getAllPayments: async () => {
    const q = query(collection(db, COLLECTION), orderBy('paymentDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  getPaymentsByStudent: async (studentId) => {
    const q = query(collection(db, COLLECTION), where('studentId', '==', studentId), orderBy('paymentDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  addPayment: async (data) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      paymentDate: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }
};
