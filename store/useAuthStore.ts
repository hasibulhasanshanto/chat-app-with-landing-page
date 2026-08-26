import { create } from 'zustand';
import { User } from '@/types/user';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/cookies';
import { getMeApi } from '@/lib/api/auth';
import { disconnectSocket } from '@/lib/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isHydrated: false,

  setAuth: (user: User, token: string) => {
    setAuthToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      isHydrated: true,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: () => {
    removeAuthToken();
    disconnectSocket();

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('chatflow_typing_sync');
        localStorage.removeItem('chatflow_message_sync');
        sessionStorage.clear();
      } catch (e) {
        // ignore
      }
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: true,
    });

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  initializeAuth: async () => {
    const token = getAuthToken();
    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isHydrated: true,
      });
      return;
    }

    // Set token & authenticated state
    set({
      token,
      isAuthenticated: true,
      isLoading: !get().user,
      isHydrated: true,
    });

    try {
      const user = await getMeApi(token);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isHydrated: true,
      });
    } catch (error) {
      console.warn('Session verification failed, clearing auth state:', error);
      removeAuthToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isHydrated: true,
      });
      disconnectSocket();
    }
  },
}));
