'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApprovalsPage() {
  return <div className="space-y-6">
    <div><h2 className="text-xl font-bold text-slate-900">Review Queue</h2><p className="text-sm text-slate-500">Verification workflow status</p></div>
    <Card className="border-amber-200 bg-amber-50/40"><CardHeader><CardTitle className="flex items-center gap-2 text-amber-900"><AlertCircle className="h-5 w-5" />Approval queue unavailable</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-amber-950"><p>The backend does not expose a persisted scheme-approval state or approve/reject operation. This page intentionally does not show demo entries or simulate approval actions.</p><Link className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 hover:bg-slate-50" href="/scraper">View real scraper jobs <ArrowRight className="ml-2 h-4 w-4" /></Link></CardContent></Card>
  </div>;
}
