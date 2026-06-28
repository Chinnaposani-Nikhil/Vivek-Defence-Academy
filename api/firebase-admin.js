import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../service-account.json');

export const getDb = () => {
  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("Firebase Admin Initialized successfully from service-account.json.");
    } catch (error) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
  return getFirestore();
};
