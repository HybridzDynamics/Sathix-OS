'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSystemStatus, type SystemStatus, type ServiceStatus } from '@/services/system';

const SERVICE_LABELS: Record<string, string> = {
  backend: 'Backend API',
  database: 'PostgreSQL (NeonDB)',
  rag_engine: 'RAG Engine',
  language_engine: 'Language Engine',
  voice_service: 'Voice Service',
  whatsapp_service: 'WhatsApp Service',
};

function StatusBadge({ status }: { status: ServiceStatus }) {
  if (status === 'Healthy')
    return (
      <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
        <CheckCircle2 className="h-4 w-4" /> Healthy
      </span>
    );
  if (status === 'Unconfigured')
    return (
      <span className="flex items-center gap-1.5 text-amber-600 font-semibold text-sm">
        <AlertCircle className="h-4 w-4" /> Unconfigured
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 text-red-600 font-semibold text-sm">
      <XCircle className="h-4 w-4" /> {status}
    </span>
  );
}

export default function StatusPage() {
  const [data, setData] = useState<SystemStatus | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(() => {
    setLoading(true);
    setError('');
    getSystemStatus()
      .then(setData)
      .catch((err) => setError(err?.message || 'Could not reach backend.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 30s
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const allHealthy =
    data && Object.values(data.services).every((s) => s === 'Healthy' || s === 'Unconfigured');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Status</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time health of all SathiX-OS microservices
          </p>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overall status banner */}
      {data && (
        <div
          className={`rounded-xl p-4 flex items-center gap-3 ${
            allHealthy
              ? 'bg-emerald-50 border border-emerald-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <Server className={`h-5 w-5 ${allHealthy ? 'text-emerald-600' : 'text-red-600'}`} />
          <div>
            <p className={`font-semibold ${allHealthy ? 'text-emerald-800' : 'text-red-800'}`}>
              {data.status === 'Operational' ? 'All Systems Operational' : 'System Degraded'}
            </p>
            <p className="text-xs text-slate-500">
              Last checked: {new Date(data.timestamp).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && !data && (
        <p className="text-sm text-slate-500 animate-pulse">Checking service health…</p>
      )}

      {/* Service cards */}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data.services).map(([key, status]) => (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {SERVICE_LABELS[key] || key}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatusBadge status={status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
