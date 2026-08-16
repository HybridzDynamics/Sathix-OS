const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://sathix-os.onrender.com';

export class BackendApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

function token() { return localStorage.getItem('sathix_user_token'); }
export function setToken(value: string) { localStorage.setItem('sathix_user_token', value); }
export function clearToken() { localStorage.removeItem('sathix_user_token'); }
export function hasToken() { return Boolean(token()); }

export async function backendApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { Accept: 'application/json', ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new BackendApiError(response.status, body?.error?.message || body?.message || 'Backend request failed.');
  return body as T;
}

export type ApiScheme = { id: string; name: string; description: string; department?: string | null; category?: string | null; benefits?: string | null; eligibility?: string | null; documentsRequired?: string | null; applicationLink?: string | null; sourceUrl?: string | null };
export type ApiApplication = { id: string; schemeId: string; status: string; submittedDate?: string | null; createdAt: string; scheme: ApiScheme };
export type ApiProfile = { user: { id: string; name: string; mobile: string; language: string; profile?: { age?: number | null; gender?: string | null; state?: string | null; district?: string | null; occupation?: string | null; income?: string | null; education?: string | null; category?: string | null; familyDetails?: string | null } | null } };

export const login = (mobile: string, password: string) => backendApi<{ token: string; user: { id: string; name: string; mobile: string; role: string; language: string } }>('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mobile, password }) });
export const register = (name: string, mobile: string, password: string) => backendApi<{ id: string }>('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, mobile, password }) });
export const getProfile = () => backendApi<ApiProfile>('/api/user/profile');
export const updateProfile = (profile: Record<string, unknown>) => backendApi('/api/user/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
export const listSchemes = () => backendApi<{ schemes: ApiScheme[] }>('/api/schemes');
export const listApplications = () => backendApi<{ applications: ApiApplication[] }>('/api/applications');
export const submitApplication = (schemeId: string) => backendApi<{ application: ApiApplication }>('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ schemeId }) });
export const chat = (message: string, language: string) => backendApi<{ answer: string; sources: unknown[]; session: { id: string } }>('/api/assistant/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, language }) });
