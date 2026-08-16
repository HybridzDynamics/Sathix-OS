'use client';

import { useEffect, useState } from 'react';
import { Activity, Bot, CheckCircle2, Database, FileText, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiError } from '@/services/api';
import { getOverview, type AdminOverview } from '@/services/overview';

const primaryMetrics = [
  ['totalSchemes', 'Total schemes', FileText], ['activeSchemes', 'Active schemes', CheckCircle2], ['indexedSchemes', 'Indexed schemes', Database],
  ['totalUsers', 'Total users', Users], ['activeAccounts', 'Active accounts', Users], ['totalApplications', 'Applications', FileText],
  ['aiQueries', 'Citizen chat queries', Bot], ['scraperRuns', 'Scraper runs', Activity], ['successfulScraperRuns', 'Completed scraper runs', CheckCircle2], ['failedScraperRuns', 'Failed scraper runs', Activity]
] as const;

export default function DashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getOverview().then((result) => { if (active) setOverview(result); })
      .catch((cause) => { if (active) setError(cause instanceof ApiError ? cause.message : 'Unable to load the operational overview.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  if (loading) return <p className="text-sm text-slate-600">Loading operational metrics…</p>;
  if (error) return <div className="space-y-3"><p role="alert" className="rounded bg-red-50 p-4 text-red-700">{error}</p><button onClick={() => { setError(''); setLoading(true); setAttempt((value) => value + 1); }} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Retry</button></div>;
  if (!overview) return null;

  const untracked = Object.entries(overview.metrics).filter(([, metric]) => !metric.tracked);
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{primaryMetrics.map(([key, label, Icon]) => {
    const metric = overview.metrics[key];
    return <Card key={key}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{label}</CardTitle><Icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{metric?.tracked ? metric.value : 'Not tracked'}</div>{!metric?.tracked && <p className="text-xs text-muted-foreground">{metric?.reason}</p>}</CardContent></Card>;
  })}</div><Card><CardHeader><CardTitle>Service availability</CardTitle></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(overview.services).map(([service, status]) => <div key={service} className="flex items-center justify-between rounded border p-3"><span className="capitalize">{service}</span><span className={status === 'healthy' ? 'text-emerald-700' : status === 'degraded' ? 'text-amber-700' : 'text-red-700'}>{status}</span></div>)}</div><p className="mt-4 text-xs text-slate-500">Generated {new Date(overview.generatedAt).toLocaleString()}</p></CardContent></Card>{untracked.length > 0 && <Card><CardHeader><CardTitle>Metrics not yet recorded</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm text-slate-600">{untracked.map(([key, metric]) => <li key={key}><span className="font-medium">{key}:</span> {metric.reason || 'Not tracked by the backend.'}</li>)}</ul></CardContent></Card>}</div>;
}
