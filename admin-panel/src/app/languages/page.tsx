'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw, Languages, Check } from 'lucide-react';

interface LanguageSetting {
  code: string;
  name: string;
  nativeName: string;
  enabled: boolean;
  coverage: number; // translation coverage percentage
  lastUpdated: string;
}

const initialLanguages: LanguageSetting[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', enabled: true, coverage: 98, lastUpdated: '1 hour ago' },
  { code: 'en', name: 'English', nativeName: 'English', enabled: true, coverage: 100, lastUpdated: '1 hour ago' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', enabled: true, coverage: 94, lastUpdated: '2 hours ago' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', enabled: true, coverage: 91, lastUpdated: '5 hours ago' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', enabled: true, coverage: 89, lastUpdated: '1 day ago' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', enabled: true, coverage: 87, lastUpdated: '1 day ago' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', enabled: false, coverage: 78, lastUpdated: '3 days ago' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', enabled: false, coverage: 65, lastUpdated: '4 days ago' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', enabled: false, coverage: 58, lastUpdated: '1 week ago' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', enabled: false, coverage: 42, lastUpdated: '1 week ago' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', enabled: false, coverage: 35, lastUpdated: '2 weeks ago' },
];

export default function LanguagesPage() {
  const [langs, setLangs] = React.useState<LanguageSetting[]>(initialLanguages);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const toggleLanguage = (code: string) => {
    setLangs(prev =>
      prev.map(lang => {
        if (lang.code === code) {
          return {
            ...lang,
            enabled: !lang.enabled,
          };
        }
        return lang;
      })
    );
  };

  const handleSyncTranslation = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setLangs(prev =>
        prev.map(lang => {
          if (lang.enabled && lang.coverage < 100) {
            return {
              ...lang,
              coverage: Math.min(100, lang.coverage + Math.floor(Math.random() * 3) + 1),
              lastUpdated: 'Just now',
            };
          }
          return lang;
        })
      );
      setIsUpdating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Multilingual Settings</h2>
          <p className="text-sm text-slate-500">Manage supported languages and translation coverage indicators</p>
        </div>
        <Button 
          disabled={isUpdating}
          onClick={handleSyncTranslation}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          {isUpdating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Sync Translation Cache
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-900 text-lg font-bold flex items-center gap-2">
              <Languages className="h-5 w-5 text-emerald-600" />
              Language Status & Coverage
            </CardTitle>
            <CardDescription>
              Toggle specific languages to enable/disable them on the citizen assistant UI. Disabling a language stops automated scraper ingestion for that translation.
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100">
            {langs.map((lang) => (
              <div key={lang.code} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{lang.name}</span>
                    <span className="text-slate-400 text-xs font-mono">({lang.nativeName})</span>
                    {lang.enabled && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 py-0 text-[10px]">
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-48 bg-slate-100 rounded-full h-1.5 shrink-0">
                      <div 
                        className={`h-1.5 rounded-full ${
                          lang.coverage > 90 
                            ? 'bg-emerald-500' 
                            : lang.coverage > 60 
                            ? 'bg-yellow-500' 
                            : 'bg-slate-400'
                        }`} 
                        style={{ width: `${lang.coverage}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 font-medium shrink-0">{lang.coverage}% translated</span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Last updated: {lang.lastUpdated}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLanguage(lang.code)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      lang.enabled ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        lang.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
