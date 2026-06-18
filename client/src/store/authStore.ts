import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types/opportunity.types';
import { login as apiLogin, register as apiRegister, logout as apiLogout, refreshToken } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (access: string, refresh: string, user: AuthUser) => void;
  refresh: () => Promise<boolean>;
  updateUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (access, refresh, user) =>
        set({ accessToken: access, refreshToken: refresh, user, isAuthenticated: true }),

      login: async (email, password) => {
        const res = await apiLogin(email, password);
        set({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user, isAuthenticated: true });
      },

      register: async (email, password, name) => {
        const res = await apiRegister(email, password, name);
        set({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user, isAuthenticated: true });
      },

      logout: async () => {
        const rt = get().refreshToken;
        if (rt) await apiLogout(rt).catch(() => undefined);
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      refresh: async () => {
        const rt = get().refreshToken;
        if (!rt) return false;
        try {
          const res = await refreshToken(rt);
          set({ accessToken: res.accessToken, refreshToken: res.refreshToken, user: res.user, isAuthenticated: true });
          return true;
        } catch {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
          return false;
        }
      },

      updateUser: (user) => set({ user }),
    }),
    { name: 'ov-auth' }
  )
);
