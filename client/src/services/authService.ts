import { apiRequest } from './api';
import type { AuthUser } from '../types/opportunity.types';

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export async function register(email: string, password: string, name?: string): Promise<AuthResponse> {
  return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }), skipAuthRetry: true });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }), skipAuthRetry: true });
}

export async function refreshToken(refresh: string): Promise<AuthResponse> {
  return apiRequest('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken: refresh }), skipAuthRetry: true });
}

export async function logout(refresh: string): Promise<void> {
  await apiRequest('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: refresh }) });
}

export async function getSettings(token: string): Promise<{ settings: AuthUser }> {
  return apiRequest('/settings', { token });
}

export async function patchSettings(
  token: string,
  data: Partial<AuthUser>
): Promise<{ settings: AuthUser }> {
  return apiRequest('/settings', { method: 'PATCH', token, body: JSON.stringify(data) });
}

export async function testExtraction(token: string, provider?: string): Promise<unknown> {
  return apiRequest('/settings/test-extraction', {
    method: 'POST',
    token,
    body: JSON.stringify({ provider }),
  });
}

export async function testNotification(
  token: string,
  topic: string,
  serverUrl?: string
): Promise<void> {
  await apiRequest('/notifications/test', {
    method: 'POST',
    token,
    body: JSON.stringify({ topic, serverUrl }),
  });
}

export async function patchNotificationSettings(
  token: string,
  data: Partial<Pick<AuthUser, 'ntfyTopic' | 'ntfyEnabled' | 'notifyDaysBefore' | 'ntfyServerUrl'>>
): Promise<{ settings: AuthUser }> {
  return apiRequest('/notifications/settings', { method: 'PATCH', token, body: JSON.stringify(data) });
}
