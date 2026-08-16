const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sathix-os.onrender.com';
const TOKEN_KEY = 'sathix_admin_token';

export type AdminSession = { user: { id: string; role: 'ADMIN' | 'SUPER_ADMIN' } };

export class AuthError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new AuthError(response.status, body.message || 'Authentication request failed.');
  return body;
}

export async function login(mobile: string, password: string): Promise<AdminSession> {
  const result = await request<{ token: string; user: { role: string } }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ mobile, password }) });
  if (!['ADMIN', 'SUPER_ADMIN'].includes(result.user.role)) throw new AuthError(403, 'This account does not have administrator access.');
  const session = await verify(result.token);
  sessionStorage.setItem(TOKEN_KEY, result.token);
  return session;
}

export async function verify(token = getToken()): Promise<AdminSession> {
  if (!token) throw new AuthError(401, 'Your session has expired.');
  return request<AdminSession>('/api/admin/session', { headers: { Authorization: `Bearer ${token}` } });
}

export function getToken(): string | null {
  return typeof window === 'undefined' ? null : sessionStorage.getItem(TOKEN_KEY);
}

export function logout() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(TOKEN_KEY);
}
