import { api } from '@/services/api';
export type AdminScheme = { id: string; name: string; description: string; department: string | null; category: string | null; state: string | null; sourceUrl: string | null; status: 'ACTIVE' | 'DISABLED' | 'ARCHIVED'; origin: 'SCRAPED' | 'ADMIN_MODIFIED'; contentHash: string | null; lastScrapedAt: string | null; indexedAt: string | null; updatedAt: string };
export type SchemePage = { items: AdminScheme[]; page: number; totalPages: number; total: number };
export type SchemeListParams = {
  page?: number;
  limit?: number;
  search?: string;
  state?: string;
  category?: string;
  department?: string;
  status?: AdminScheme['status'];
  origin?: AdminScheme['origin'];
  indexed?: 'true' | 'false';
};

export function listSchemes(params: SchemeListParams) {
  const query = new URLSearchParams();
  const values: Record<string, string | number | undefined> = { limit: 25, ...params };

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && String(value).trim() !== '') {
      query.set(key, String(value));
    }
  }

  return api<SchemePage>(`/api/admin/schemes?${query.toString()}`);
}
export const updateSchemeStatus = (id: string, status: AdminScheme['status']) => api<{ scheme: AdminScheme }>(`/api/admin/schemes/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
export const reindexScheme = (id: string) => api<{ scheme: AdminScheme }>(`/api/admin/schemes/${id}/reindex`, { method: 'POST' });
