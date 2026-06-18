import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  viewMode: 'table' | 'card';
  aiProvider: string;
  setViewMode: (mode: 'table' | 'card') => void;
  setAiProvider: (provider: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      viewMode: 'table',
      aiProvider: 'groq',
      setViewMode: (mode) => set({ viewMode: mode }),
      setAiProvider: (provider) => set({ aiProvider: provider }),
    }),
    { name: 'ov-settings' }
  )
);
