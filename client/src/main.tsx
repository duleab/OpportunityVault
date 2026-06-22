import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerTokenRefresh } from './services/api';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
import './index.css';

registerTokenRefresh(async () => {
  const ok = await useAuthStore.getState().refresh();
  return ok ? useAuthStore.getState().accessToken : null;
});

// Apply theme class to <html> on load and on change
function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
}

// Apply immediately from persisted store
applyTheme(useSettingsStore.getState().theme);

// Subscribe to future changes
useSettingsStore.subscribe((state) => applyTheme(state.theme));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
