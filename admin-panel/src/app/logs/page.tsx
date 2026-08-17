'use client';

import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LogsPage() {
  return <div className="space-y-6"><div><h2 className="text-xl font-bold text-slate-900">System Logs</h2><p className="text-sm text-slate-500">Operational audit information</p></div><Card className="border-amber-200 bg-amber-50/40"><CardHeader><CardTitle className="flex items-center gap-2 text-amber-900"><AlertCircle className="h-5 w-5" />Logs are not exposed by the backend</CardTitle></CardHeader><CardContent className="text-sm text-amber-950">No admin logs endpoint exists yet. To avoid displaying fabricated log records, this page remains intentionally empty until a secured, paginated audit-log API is implemented.</CardContent></Card></div>;
}
