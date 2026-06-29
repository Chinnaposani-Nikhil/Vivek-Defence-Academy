import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
export const getDb = () => {
  if (!getApps().length) {
    try {
      // Create credential object from environment variables
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey) {
        // Strip leading/trailing quotes if they accidentally pasted them in Vercel
        privateKey = privateKey.replace(/(^['"]|['"]$)/g, '').trim();
        // Handle escaped newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      if (clientEmail) {
        clientEmail = clientEmail.replace(/(^['"]|['"]$)/g, '').trim();
      }

      const credentialParams = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: clientEmail,
        privateKey: privateKey,
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
