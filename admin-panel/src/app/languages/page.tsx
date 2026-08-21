'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';
import { ApiError } from '@/services/api';
import { listLanguages, type AdminLanguage } from '@/services/languages';

export default function LanguagesPage() {
  const [langs, setLangs] = useState<AdminLanguage[]>([]);
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLanguages()
      .then((result) => {
        setLangs(result.languages);
        setSource(result.source);
      })
      .catch((cause) => setError(cause instanceof ApiError ? cause.message : 'Unable to load languages from Language Engine.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading languages…</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Multilingual Settings</h2>
        <p className="text-sm text-slate-500">
          Languages supported by the Language Engine · source: {source || 'unknown'}
        </p>
      </div>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 text-lg font-bold flex items-center gap-2">
            <Languages className="h-5 w-5 text-emerald-600" />
            Supported Languages ({langs.length})
          </CardTitle>
          <CardDescription>
            Read-only registry from the Language Engine. Enable/disable controls require a persisted language policy model (not yet implemented).
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          {langs.map((lang) => (
            <div key={lang.code} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{lang.name}</span>
                  <span className="text-slate-400 text-xs font-mono">({lang.nativeName})</span>
                  <Badge variant="outline" className="text-[10px]">{lang.code}</Badge>
                  {lang.isIndic && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-0 text-[10px]">Indic</Badge>
                  )}
                </div>
                {lang.script && <p className="text-xs text-slate-500 mt-1">Script: {lang.script}</p>}
              </div>
            </div>
          ))}
          {langs.length === 0 && !error && <p className="text-slate-600">No languages returned by the Language Engine.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
