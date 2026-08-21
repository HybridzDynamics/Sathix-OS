'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ApiError } from '@/services/api';
import { createSource, deleteSource, listSources, type Source } from '@/services/sources';

export default function SourcesPage() {
  const [items, setItems] = useState<Source[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    listSources({ page, search: search || undefined })
      .then((result) => {
        if (active) {
          setItems(result.items);
          setTotalPages(Math.max(1, result.totalPages));
        }
      })
      .catch((cause) => {
        if (active) setError(cause instanceof ApiError ? cause.message : 'Unable to load sources.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [page, search, refresh]);

  const reload = () => { setLoading(true); setRefresh((v) => v + 1); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      await createSource({ url, title: title || undefined, state: state || undefined });
      setUrl(''); setTitle(''); setState('');
      reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create source.');
    }
  }

  async function remove(source: Source) {
    if (!window.confirm(`Delete source ${source.title || source.url}?`)) return;
    try {
      await deleteSource(source.id);
      reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Delete failed.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Sources</h2>
        <p className="text-sm text-slate-500">Registered government scheme source URLs</p>
      </div>
      <form onSubmit={submit} className="flex flex-wrap gap-3 rounded border bg-white p-4">
        <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://gov.example/schemes" className="min-w-64 rounded border p-2" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" className="rounded border p-2" />
        <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State (optional)" className="rounded border p-2" />
        <button className="rounded bg-emerald-700 px-4 py-2 text-white">Add source</button>
      </form>
      <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Search sources" className="rounded border p-2" />
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {loading ? <p>Loading sources…</p> : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b"><th className="p-3">Source</th><th>State</th><th>Added</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {items.map((source) => (
                <tr key={source.id} className="border-b">
                  <td className="p-3">
                    <div className="font-medium">{source.title || 'Untitled'}</div>
                    <a className="text-xs text-blue-700 underline" href={source.url} target="_blank" rel="noreferrer">{source.url}</a>
                  </td>
                  <td>{source.state || '—'}</td>
                  <td>{new Date(source.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><button onClick={() => remove(source)} className="rounded border px-2 py-1 text-red-700">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-4 text-slate-600">No sources registered yet.</p>}
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
