import { api } from '@/services/api';
export type ScraperJob = { id: string; sourceUrl: string; sourceName: string | null; status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'; startedAt: string | null; completedAt: string | null; pagesProcessed: number; pagesFailed: number; schemesDiscovered: number; newSchemes: number | null; updatedSchemes: number | null; failedItems: number; error: string | null; retryCount: number; createdAt: string };
export type ScraperJobsPage = { items: ScraperJob[]; page: number; totalPages: number; total: number };
export type ScraperStatus = { byStatus: Record<string, number>; latest: ScraperJob | null; queue: Record<string, number> | null };
export const getScraperStatus = () => api<ScraperStatus>('/api/admin/scraper/status');
export const listScraperJobs = (page: number, status = '') => api<ScraperJobsPage>(`/api/admin/scraper/jobs?${new URLSearchParams({ page: String(page), limit: '25', ...(status ? { status } : {}) })}`);
export const createScraperJob = (sourceUrl: string, sourceName?: string) => api<{ job: ScraperJob }>('/api/admin/scraper/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourceUrl, sourceName }) });
export const retryScraperJob = (id: string) => api<{ job: ScraperJob }>(`/api/admin/scraper/jobs/${id}/retry`, { method: 'POST' });
export const cancelScraperJob = (id: string) => api<{ job: ScraperJob }>(`/api/admin/scraper/jobs/${id}/cancel`, { method: 'POST' });
