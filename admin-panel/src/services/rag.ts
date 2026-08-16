import { api } from '@/services/api';
export type RagStatus = { service: { available: boolean; status: string; qdrant: string }; totalSchemes: number; indexedDocuments: { value: number | null; tracked: boolean; reason?: string }; indexedChunks: { value: number | null; tracked: boolean; reason?: string }; embeddingModel: { value: string | null; tracked: boolean; reason?: string }; embeddingDimensions: { value: number | null; tracked: boolean; reason?: string }; lastIndexRun: { value: string | null; tracked: boolean; reason?: string } };
export const getRagStatus = () => api<RagStatus>('/api/admin/rag/status');
export const reindexAll = () => api<{ completed: boolean; count: number | null }>('/api/admin/rag/reindex', { method: 'POST' });
