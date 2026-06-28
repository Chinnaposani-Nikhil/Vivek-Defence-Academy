import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
export const getDb = () => {
  if (!getApps().length) {
    try {
      // Create credential object from environment variables
      const credentialParams = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Private key needs to handle escaped newlines in environment variables
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      };

      initializeApp({
        credential: cert(credentialParams),
      });
      console.log("Firebase Admin Initialized successfully from environment variables.");
    } catch (error) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
  return getFirestore();
};
