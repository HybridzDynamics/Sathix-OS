import { api } from '@/services/api';

export type AdminUser = { id: string; name: string; mobile: string; email: string | null; role: 'CITIZEN' | 'ADMIN' | 'SUPER_ADMIN' | 'PARTNER'; isActive: boolean; language: string; createdAt: string; lastActiveAt: string | null; profile: { state: string | null; district: string | null } | null };
export type UserPage = { items: AdminUser[]; page: number; limit: number; total: number; totalPages: number };

export function listUsers(params: { page: number; search?: string; role?: string; isActive?: string }) {
  const query = new URLSearchParams({ page: String(params.page), limit: '25', ...(params.search ? { search: params.search } : {}), ...(params.role ? { role: params.role } : {}), ...(params.isActive ? { isActive: params.isActive } : {}) });
  return api<UserPage>(`/api/admin/users?${query}`);
}
export const updateUserStatus = (id: string, isActive: boolean) => api<{ user: AdminUser }>(`/api/admin/users/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive }) });
export const updateUserRole = (id: string, role: AdminUser['role']) => api<{ user: AdminUser }>(`/api/admin/users/${id}/role`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
