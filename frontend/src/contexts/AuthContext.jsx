import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// ─── Auth Context ────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ─── Auth Provider ───────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes (persists across refreshes automatically)
  useEffect(() => {
    let timeoutId;
    
    // Fallback: If Firebase takes longer than 5 seconds, force loading to false
    // to prevent infinite blank screen bug.
    timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Firebase auth initialization timed out. Forcing load to finish.");
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, 
      (firebaseUser) => {
        clearTimeout(timeoutId);
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error("Auth state change error:", error);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  // Google Sign-In
  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      // Handle specific error codes gracefully
      if (error.code === 'auth/popup-closed-by-user') {
        return null; // User closed the popup — not a real error
      }
      if (error.code === 'auth/cancelled-popup-request') {
        return null;
      }
      console.error('Google sign-in error:', error);
      throw error;
    }
  }, []);

  // Sign Out
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
