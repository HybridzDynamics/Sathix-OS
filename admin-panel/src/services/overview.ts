import { api } from '@/services/api';

export type Metric = { value: number | null; tracked: boolean; reason?: string };
export type AdminOverview = {
  generatedAt: string;
  metrics: Record<string, Metric>;
  services: Record<string, string>;
};

export const getOverview = () => api<AdminOverview>('/api/admin/overview');
