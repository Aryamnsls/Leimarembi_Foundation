const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lf_token');
}

export function getAuthUser(): any | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('lf_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lf_token');
  localStorage.removeItem('lf_user');
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message?: string; data?: T; pagination?: any }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let json: any;
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      json = await res.json();
    } catch {
      json = { success: false, message: 'Invalid JSON response from server' };
    }
  } else {
    const text = await res.text().catch(() => '');
    json = { success: res.ok, message: text || `Server responded with HTTP ${res.status}` };
  }

  if (!res.ok) {
    const errorMsg = json.message || json.error?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return json;
}

export const api = {
  get: <T = any>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any) => apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body?: any) => apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = any>(endpoint: string, body?: any) => apiFetch<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' }),
};
