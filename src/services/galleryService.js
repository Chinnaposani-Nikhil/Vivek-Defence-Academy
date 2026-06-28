import { collection, doc, getDocs, addDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const COLLECTION = 'gallery';

export const galleryService = {
  getAllImages: async () => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  uploadImage: async (file, category, caption) => {
    // 1. Upload to Storage
    const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
    const uploadResult = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(uploadResult.ref);
    
    // 2. Save reference in Firestore
    const docRef = await addDoc(collection(db, COLLECTION), {
      url,
      path: uploadResult.ref.fullPath,
      category: category || 'General',
      caption: caption || '',
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, url };
  },
  deleteImage: async (id, imagePath) => {
    // 1. Delete from Storage
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
    // 2. Delete from Firestore
    await deleteDoc(doc(db, COLLECTION, id));
  }
};
