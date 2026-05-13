'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthToken, getAuthToken, getCurrentUser, logoutUser, refreshSession } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
  healthInfo?: {
    allergies?: string[];
    medications?: string[];
    chronicConditions?: string[];
    recentSymptoms?: string[];
  };
  profile?: {
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
    bloodType?: string;
    country?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via cookie on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!getAuthToken()) {
        await refreshSession();
      }

      const data = await getCurrentUser();
      setUser(data);
    } catch {
      clearAuthToken();
      console.error('Auth check failed');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    if (!userData.onboardingComplete) {
      router.push('/onboarding');
    } else {
      router.push('/home');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      console.error('Logout request failed');
      clearAuthToken();
    }
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: checkAuth, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
