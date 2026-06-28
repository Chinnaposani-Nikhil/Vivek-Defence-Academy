import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is an admin in Firestore
  const checkAdminRole = async (uid) => {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        if (data.role === 'admin' || data.role === 'superadmin') {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const isUserAdmin = await checkAdminRole(user.uid);
    if (!isUserAdmin) {
      await auth.signOut();
      throw new Error("Access denied. Admin privileges required.");
    }
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // First check if they are already an admin
    let isUserAdmin = await checkAdminRole(user.uid);
    
    // If not an admin, but it's their first time, we might want to register them as pending
    // For now, strict check:
    if (!isUserAdmin) {
      await auth.signOut();
      throw new Error("Access denied. Your Google account does not have Admin privileges.");
    }
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isUserAdmin = await checkAdminRole(user.uid);
        if (isUserAdmin) {
          setCurrentUser(user);
          setIsAdmin(true);
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
          await auth.signOut(); // Force logout if somehow auth state persisted
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
