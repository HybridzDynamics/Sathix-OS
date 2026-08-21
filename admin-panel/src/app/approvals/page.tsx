'use client';

import { useEffect, useState } from 'react';
import { ApiError } from '@/services/api';
import { approveScheme, listApprovals, rejectScheme } from '@/services/approvals';
import type { AdminScheme } from '@/services/schemes';

export default function ApprovalsPage() {
  const [items, setItems] = useState<AdminScheme[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    listApprovals(page)
      .then((result) => {
        if (active) {
          setItems(result.items);
          setTotalPages(Math.max(1, result.totalPages));
        }
      })
      .catch((cause) => {
        if (active) setError(cause instanceof ApiError ? cause.message : 'Unable to load approval queue.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [page, refresh]);

  const reload = () => { setLoading(true); setRefresh((v) => v + 1); };

  async function approve(scheme: AdminScheme) {
    if (!window.confirm(`Approve "${scheme.name}" for publication?`)) return;
    try {
      await approveScheme(scheme.id);
      reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Approval failed.');
    }
  }

  async function reject(scheme: AdminScheme) {
    if (!window.confirm(`Reject "${scheme.name}" and archive it?`)) return;
    try {
      await rejectScheme(scheme.id);
      reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Rejection failed.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Review Queue</h2>
        <p className="text-sm text-slate-500">Scraped schemes awaiting admin approval (status: DISABLED)</p>
      </div>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {loading ? <p>Loading queue…</p> : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3">Scheme</th>
                <th>Category</th>
                <th>State</th>
                <th>Scraped</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((scheme) => (
                <tr key={scheme.id} className="border-b">
                  <td className="p-3">
                    <div className="font-medium">{scheme.name}</div>
                    <div className="text-slate-500 line-clamp-2 max-w-md">{scheme.description}</div>
                  </td>
                  <td>{scheme.category || '—'}</td>
                  <td>{scheme.state || 'All India'}</td>
                  <td>{scheme.lastScrapedAt ? new Date(scheme.lastScrapedAt).toLocaleDateString() : '—'}</td>
                  <td className="space-x-2 p-3">
                    <button onClick={() => approve(scheme)} className="rounded border border-emerald-600 px-2 py-1 text-emerald-700">Approve</button>
                    <button onClick={() => reject(scheme)} className="rounded border px-2 py-1 text-red-700">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-4 text-slate-600">No schemes are pending review.</p>}
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
