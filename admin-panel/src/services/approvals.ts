import { api } from '@/services/api';
import type { AdminScheme } from '@/services/schemes';

export type ApprovalPage = { items: AdminScheme[]; page: number; limit: number; total: number; totalPages: number };

export function listApprovals(page: number) {
  return api<ApprovalPage>(`/api/admin/approvals?page=${page}&limit=25`);
}

export const approveScheme = (id: string) =>
  api<{ scheme: AdminScheme }>(`/api/admin/approvals/${id}/approve`, { method: 'POST' });

export const rejectScheme = (id: string) =>
  api<{ scheme: AdminScheme }>(`/api/admin/approvals/${id}/reject`, { method: 'POST' });
