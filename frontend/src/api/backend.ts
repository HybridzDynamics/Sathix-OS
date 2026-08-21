const API_BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('sathix_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, body?.message || 'Request failed');
  }
  return body as T;
}

// Auth
export const login = (mobile: string, password: string) =>
  apiFetch<{ token: string; user: { id: string; name: string; role: string } }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password }),
  });

// Schemes
export const listSchemes = (params?: { search?: string; category?: string; state?: string }) => {
  const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
  return apiFetch<{ schemes: any[]; total: number }>(`/api/schemes${qs}`);
};

// AI Assistant (RAG)
export const chat = (message: string, language: string, sessionId?: string) =>
  apiFetch<{ answer: string; sources: unknown[]; session: { id: string } }>('/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, ...(sessionId ? { sessionId } : {}) }),
  });

// Health / status
export const getSystemStatus = () =>
  apiFetch<{ status: string; services: Record<string, string>; timestamp: string }>('/api/system/status');

export default apiFetch;
