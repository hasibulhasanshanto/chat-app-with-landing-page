'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/types/user';
import { AuthContextType } from '@/types/auth';
import { loginApi, getMeApi } from '@/lib/api/auth';
import { getStoredToken, setStoredToken, removeStoredToken } from '@/lib/api/client';
import { disconnectSocket } from '@/lib/socket';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on initial load
  useEffect(() => {
    async function restoreSession() {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const me = await getMeApi(storedToken);
        setUser(me);
      } catch (err) {
        console.warn('Session restoration failed:', err);
        removeStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (phone: string, name: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await loginApi({ phone, name });
      setStoredToken(response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setUser(null);
    disconnectSocket();
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
