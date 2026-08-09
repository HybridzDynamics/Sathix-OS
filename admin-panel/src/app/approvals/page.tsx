'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { mockPendingApprovals, ScrapedSchemeApproval } from '@/lib/mock-data/scraper-jobs';
import { FileText, Eye, Check, X, ExternalLink } from 'lucide-react';

export default function ApprovalsPage() {
  const [queue, setQueue] = React.useState<ScrapedSchemeApproval[]>(mockPendingApprovals);
  const [selectedScheme, setSelectedScheme] = React.useState<ScrapedSchemeApproval | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const handleApprove = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    if (selectedScheme?.id === id) {
      setDetailOpen(false);
      setSelectedScheme(null);
    }
  };

  const handleReject = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    if (selectedScheme?.id === id) {
      setDetailOpen(false);
      setSelectedScheme(null);
    }
  };

  const viewDetails = (scheme: ScrapedSchemeApproval) => {
    setSelectedScheme(scheme);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Review Queue</h2>
          <p className="text-sm text-slate-500">Newly scraped schemes awaiting verification</p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          {queue.length} Awaiting Review
        </Badge>
      </div>

      {queue.length === 0 ? (
        <Card className="border-slate-200 p-12 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <Check className="h-12 w-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
            <p className="text-sm text-slate-500">There are no scraped schemes currently waiting for approval.</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {queue.map((scheme) => (
            <Card key={scheme.id} className="border-slate-200 flex flex-col justify-between">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <Badge variant="outline" className="bg-slate-100 border-slate-200 text-slate-700 text-xs">
                    {scheme.department}
                  </Badge>
                  <span className="text-xs text-slate-400">{scheme.dateScraped}</span>
                </div>
                <CardTitle className="text-base text-slate-900 font-bold line-clamp-1">{scheme.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 text-sm text-slate-600">
                <p className="line-clamp-3 mb-4">{scheme.eligibilitySummary}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-600 transition-colors">
                  <ExternalLink className="h-3 w-3" />
                  <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
                    {scheme.sourceUrl}
                  </a>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 pt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => viewDetails(scheme)}
                  className="flex-1 text-slate-700 hover:text-slate-900"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Details
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleApprove(scheme.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleReject(scheme.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Slide-out detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white border-l border-slate-200">
          {selectedScheme && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Pending Review
                  </Badge>
                  <Badge variant="outline" className="bg-slate-100 border-slate-200 text-slate-700">
                    {selectedScheme.department}
                  </Badge>
                </div>
                <SheetTitle className="text-xl font-bold text-slate-900">{selectedScheme.name}</SheetTitle>
                <SheetDescription className="text-xs text-slate-400">Scraped on {selectedScheme.dateScraped}</SheetDescription>
              </SheetHeader>

              <div className="space-y-4 text-slate-700">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Extracted Eligibility Rules</h4>
                  <p className="text-sm bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-600">
                    {selectedScheme.eligibilitySummary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Source URL</span>
                    <a 
                      href={selectedScheme.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      Visit portal <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Parsed Department</span>
                    <span className="text-sm font-medium block">{selectedScheme.department}</span>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Additional Raw Metadata</h4>
                  <div className="text-xs font-mono bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto space-y-2">
                    <div><span className="text-emerald-400">"age_limit":</span> "18-60 years"</div>
                    <div><span className="text-emerald-400">"income_limit":</span> "Below INR 1,20,000 per annum"</div>
                    <div><span className="text-emerald-400">"documents_required":</span> ["Aadhaar", "Income Certificate", "Domicile"]</div>
                    <div><span className="text-emerald-400">"parsing_confidence":</span> "94.2%"</div>
                    <div><span className="text-emerald-400">"ocr_language":</span> "Hindi"</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={() => handleApprove(selectedScheme.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Entry
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleReject(selectedScheme.id)}
                  className="bg-red-500 hover:bg-red-600 text-white flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Entry
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
