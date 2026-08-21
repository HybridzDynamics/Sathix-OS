import { api } from '@/services/api';

export type ServiceStatus = 'Healthy' | 'Down' | 'Unconfigured' | 'Unknown';

export interface SystemStatus {
  timestamp: string;
  status: 'Operational' | 'Degraded';
  services: {
    backend: ServiceStatus;
    database: ServiceStatus;
    rag_engine: ServiceStatus;
    language_engine: ServiceStatus;
    voice_service: ServiceStatus;
    whatsapp_service: ServiceStatus;
  };
}

export const getSystemStatus = () => api<SystemStatus>('/api/system/status');
