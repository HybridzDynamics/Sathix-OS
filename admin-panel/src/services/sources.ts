import { api } from '@/services/api';

export type Source = { id: string; url: string; title: string | null; state: string | null; createdAt: string };
export type SourcePage = { items: Source[]; page: number; limit: number; total: number; totalPages: number };

export function listSources(params: { page: number; search?: string }) {
  const query = new URLSearchParams({ page: String(params.page), limit: '25', ...(params.search ? { search: params.search } : {}) });
  return api<SourcePage>(`/api/admin/sources?${query}`);
}

export function createSource(data: { url: string; title?: string; state?: string }) {
  return api<{ source: Source }>('/api/admin/sources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function deleteSource(id: string) {
  return api<{ source: Source }>(`/api/admin/sources/${id}`, { method: 'DELETE' });
}
