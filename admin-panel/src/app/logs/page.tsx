'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/services/api';
import { listLogs, type SystemLog } from '@/services/logs';

export default function LogsPage() {
  const [items, setItems] = useState<SystemLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState<'all' | 'audit' | 'scraper'>('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listLogs({ page, type: type === 'all' ? undefined : type })
      .then((result) => {
        if (active) {
          setItems(result.items);
          setTotalPages(Math.max(1, result.totalPages));
        }
      })
      .catch((cause) => {
        if (active) setError(cause instanceof ApiError ? cause.message : 'Unable to load logs.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [page, type]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">System Logs</h2>
        <p className="text-sm text-slate-500">Audit trail and scraper operational records from the database</p>
      </div>
      <div className="flex gap-3">
        <select value={type} onChange={(e) => { setPage(1); setType(e.target.value as typeof type); }} className="rounded border p-2">
          <option value="all">All logs</option>
          <option value="audit">Audit only</option>
          <option value="scraper">Scraper only</option>
        </select>
      </div>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {loading ? (
        <p>Loading logs…</p>
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3">Time</th>
                <th>Type</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {items.map((log) => (
                <tr key={`${log.type}-${log.id}`} className="border-b">
                  <td className="p-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td><span className="rounded bg-slate-100 px-2 py-0.5 text-xs uppercase">{log.type}</span></td>
                  <td className="font-medium">{log.action}</td>
                  <td>{log.entity}{log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ''}</td>
                  <td className="max-w-md truncate text-slate-600">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-4 text-slate-600">No log records found.</p>}
        </div>
      )}
      <div className="flex gap-3">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-50">Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
