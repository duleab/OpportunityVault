const API_URL = import.meta.env.VITE_API_URL ?? '/api';

interface RequestOptions extends RequestInit {
  token?: string | null;
  skipAuthRetry?: boolean;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

type TokenRefreshFn = () => Promise<string | null>;
let onTokenRefresh: TokenRefreshFn | null = null;
let refreshInFlight: Promise<string | null> | null = null;

export function registerTokenRefresh(fn: TokenRefreshFn): void {
  onTokenRefresh = fn;
}

async function getRefreshedToken(): Promise<string | null> {
  if (!onTokenRefresh) return null;
  if (!refreshInFlight) {
    refreshInFlight = onTokenRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function fetchWithAuth(path: string, options: RequestOptions = {}): Promise<Response> {
  const { token, skipAuthRetry, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (res.status !== 401 || skipAuthRetry || !token) return res;

  const newToken = await getRefreshedToken();
  if (!newToken) return res;

  return fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
      ...headers,
    },
  });
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetchWithAuth(path, options);

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(res.status, body.error ?? res.statusText);
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as Promise<T>;
}

export async function authenticatedFetch(path: string, options: RequestInit & { token?: string | null } = {}): Promise<Response> {
  const { token, ...rest } = options;
  return fetchWithAuth(path, { ...rest, token });
}

export function getApiUrl(): string {
  return API_URL;
}
