import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  viewMode: 'table' | 'card';
  aiProvider: string;
  theme: 'dark' | 'light';
  setViewMode: (mode: 'table' | 'card') => void;
  setAiProvider: (provider: string) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      viewMode: 'table',
      aiProvider: 'groq',
      theme: 'dark',
      setViewMode: (mode) => set({ viewMode: mode }),
      setAiProvider: (provider) => set({ aiProvider: provider }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'ov-settings' }
  )
);
