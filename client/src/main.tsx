import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerTokenRefresh } from './services/api';
import { useAuthStore } from './store/authStore';
import './index.css';

registerTokenRefresh(async () => {
  const ok = await useAuthStore.getState().refresh();
  return ok ? useAuthStore.getState().accessToken : null;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
