'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockScraperJobs, ScraperJob } from '@/lib/mock-data/scraper-jobs';
import { mockLogs } from '@/lib/mock-data/logs';
import { Play, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ScraperPage() {
  const [jobs, setJobs] = React.useState<ScraperJob[]>(mockScraperJobs);
  const [runningJobId, setRunningJobId] = React.useState<string | null>(null);

  const handleRunNow = (id: string) => {
    setRunningJobId(id);
    
    // Simulate API scraping call
    setTimeout(() => {
      setJobs(prev => prev.map(job => {
        if (job.id === id) {
          return {
            ...job,
            status: 'Success',
            lastRunTime: new Date().toLocaleString(),
            schemesFound: job.schemesFound + Math.floor(Math.random() * 10),
            schemesAdded: job.schemesAdded + Math.floor(Math.random() * 3),
          };
        }
        return job;
      }));
      setRunningJobId(null);
    }, 2000);
  };

  // Filter logs related to Scraper
  const scraperLogs = mockLogs.filter(log => log.source === 'Scraper');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Scraper Control Center</h2>
        <p className="text-sm text-slate-500">Monitor automated scheme discovery crawlers and run schedules</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => {
          const isRunning = runningJobId === job.id || job.status === 'Running';
          return (
            <Card key={job.id} className="border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">{job.id}</span>
                    <CardTitle className="text-base text-slate-900 font-bold mt-0.5">{job.sourceName}</CardTitle>
                  </div>
                  <Badge 
                    className={
                      job.status === 'Success' 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                        : job.status === 'Failed' 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : job.status === 'Running' || isRunning
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-yellow-500 text-white'
                    }
                  >
                    {isRunning ? 'Running' : job.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm border-t border-b border-slate-100 py-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Schemes Found</span>
                    <span className="text-base font-semibold text-slate-800">{job.schemesFound}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Newly Added</span>
                    <span className="text-base font-semibold text-slate-800">{job.schemesAdded}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Last run: {job.lastRunTime}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                    disabled={isRunning}
                    onClick={() => handleRunNow(job.id)}
                  >
                    {isRunning ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3 mr-1.5 fill-current" />
                    )}
                    Run Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 text-lg font-bold">Scraper Log History</CardTitle>
          <CardDescription>Recent events and activity logs specifically from scraper sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scraperLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-slate-500">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          log.level === 'Error' 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : log.level === 'Warning' 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }
                      >
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700 text-sm">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
