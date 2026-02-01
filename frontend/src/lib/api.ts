import type { User, Deal, Claim } from '@/types';

// Use same-origin /api (proxied to backend) by default to avoid CORS and connection issues
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api' : 'http://localhost:4000/api');

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || res.statusText || 'Request failed');
  }
  return data as T;
}

export const api = {
  auth: {
    register: (body: { email: string; password: string; name: string }) =>
      request<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    me: () =>
      request<{ user: User }>('/auth/me'),
  },
  deals: {
    list: (params?: { category?: string; accessLevel?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.accessLevel) searchParams.set('accessLevel', params.accessLevel);
      if (params?.search) searchParams.set('search', params.search);
      const qs = searchParams.toString();
      return request<{ deals: Deal[] }>(`/deals${qs ? `?${qs}` : ''}`);
    },
    get: (id: string) =>
      request<{ deal: Deal }>(`/deals/${id}`),
  },
  claims: {
    list: () =>
      request<{ claims: Claim[] }>('/claims'),
    create: (dealId: string) =>
      request<{ claim: Claim }>('/claims', {
        method: 'POST',
        body: JSON.stringify({ dealId }),
      }),
  },
};
