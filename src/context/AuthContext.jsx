import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  signOut as apiSignOut,
  getUserProfile,
  isUserAdmin,
  resetPassword as apiResetPassword,
  updatePassword as apiUpdatePassword
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    const adminStatus = isUserAdmin(currentUser, null);
    setIsAdmin(adminStatus);

    const { profile: userProf } = await getUserProfile(currentUser.id);
    if (userProf) {
      setProfile(userProf);
      setIsAdmin(isUserAdmin(currentUser, userProf));
    }
  };

  useEffect(() => {
    // 1. Initial session restoration
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        refreshProfile(currentUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        await refreshProfile(currentUser);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (credentials) => {
    const res = await apiSignIn(credentials);
    if (res.data?.user) {
      setUser(res.data.user);
      await refreshProfile(res.data.user);
    }
    return res;
  };

  const signUp = async (credentials) => {
    return await apiSignUp(credentials);
  };

  const signOut = async () => {
    const res = await apiSignOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    return res;
  };

  const resetPassword = async (email) => {
    return await apiResetPassword(email);
  };

  const updatePassword = async (newPassword) => {
    return await apiUpdatePassword(newPassword);
  };

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile: () => refreshProfile(user)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

