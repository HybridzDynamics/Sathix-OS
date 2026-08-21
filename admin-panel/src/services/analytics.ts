import { api } from '@/services/api';

export type AnalyticsData = {
  generatedAt: string;
  schemesByState: { state: string; count: number }[];
  languageDistribution: { name: string; value: number }[];
  queryVolume: { date: string; total: number }[];
  applications: { status: string; count: number }[];
  categories: { category: string; count: number }[];
  scraperJobs: Record<string, number>;
  totals: { userQueriesLast7Days: number; activeSchemeStates: number };
};

export const getAnalytics = () => api<AnalyticsData>('/api/admin/analytics');
