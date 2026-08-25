'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface UserSessionData {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  totalScore: number;
}

interface AuthContextType {
  user: UserSessionData | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshSession: async () => {},
  signOutUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSessionData | null>(null);
  const [loading, setLoading] = useState(true);

  const syncBackendSession = async (firebaseUser: FirebaseUser) => {
    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.error('Failed to sync backend session:', e);
    }
  };

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Session fetch error:', e);
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user exists; sync server cookie to guarantee matching session
        await syncBackendSession(firebaseUser);
      } else {
        // Signed out on Firebase; clear backend session cookie
        try {
          await fetch('/api/auth/sign-out', { method: 'POST' });
        } catch (e) {
          console.error('Error signing out session:', e);
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshSession = async () => {
    await fetchSession();
  };

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
      await fetch('/api/auth/sign-out', { method: 'POST' });
      setUser(null);
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshSession, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
