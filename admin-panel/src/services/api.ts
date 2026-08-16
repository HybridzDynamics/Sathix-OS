import { getToken, logout } from '@/services/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sathix-os.onrender.com';

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) logout();
    throw new ApiError(response.status, body.message || 'Backend request failed.');
  }
  return body as T;
}
