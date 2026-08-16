import { getToken, logout } from '@/services/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sathix-os.onrender.com';

export class ApiError extends Error {
  constructor(public status: number, message: string, public requestId?: string) { super(message); }
}

type ErrorBody = { message?: string; requestId?: string };

function requestId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `admin-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const correlationId = requestId();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'omit',
    headers: { Accept: 'application/json', 'X-Request-ID': correlationId, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({})) as ErrorBody;
  if (!response.ok) {
    if (response.status === 401) logout();
    throw new ApiError(response.status, body.message || 'Backend request failed.', body.requestId || response.headers.get('x-request-id') || correlationId);
  }
  return body as T;
}
