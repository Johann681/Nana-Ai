'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
      const apiBase = process.env.NEXT_PUBLIC_API_URL;
      // First try to refresh token
      const refreshRes = await fetch(`${apiBase}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
      
      if (refreshRes.ok) {
        // Then get user data
        const meRes = await fetch(`${apiBase}/api/auth/me`, { credentials: 'include' });
        if (meRes.ok) {
          const data = await meRes.json();
          setUser(data);
        }
      }
    } catch {
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      console.error('Logout request failed');
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
