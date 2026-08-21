import { api } from '@/services/api';

export type SystemLog = {
  id: string;
  type: 'audit' | 'scraper';
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
};

export type LogPage = { items: SystemLog[]; page: number; limit: number; total: number; totalPages: number };

export function listLogs(params: { page: number; type?: string; action?: string; status?: string }) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: '25',
    ...(params.type ? { type: params.type } : {}),
    ...(params.action ? { action: params.action } : {}),
    ...(params.status ? { status: params.status } : {}),
  });
  return api<LogPage>(`/api/admin/logs?${query}`);
}
