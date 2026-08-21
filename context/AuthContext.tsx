'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoginMutation } from '@/hooks/queries/useAuthQueries';
import { User } from '@/types/user';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, isAuthenticated, isLoading, logout, setUser, initializeAuth } = useAuthStore();
  const loginMutation = useLoginMutation();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (phone: string, name: string): Promise<User> => {
    const result = await loginMutation.mutateAsync({ phone, name });
    return result.user;
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading: isLoading || loginMutation.isPending,
    isAuthenticated,
    login,
    logout,
    updateUser: setUser,
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
