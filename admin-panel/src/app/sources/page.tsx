'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SourcesPage() {
  return <div className="space-y-6">
    <div><h2 className="text-xl font-bold text-slate-900">Sources</h2><p className="text-sm text-slate-500">Managed source registry</p></div>
    <Card className="border-amber-200 bg-amber-50/40"><CardHeader><CardTitle className="flex items-center gap-2 text-amber-900"><AlertCircle className="h-5 w-5" />Source registry unavailable</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-amber-950"><p>The backend has no administered source CRUD API. Creating or deleting entries here would only be local UI state, so those controls are intentionally unavailable.</p><Link className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 hover:bg-slate-50" href="/scraper">Submit and track a real scrape job <ArrowRight className="ml-2 h-4 w-4" /></Link></CardContent></Card>
  </div>;
}
