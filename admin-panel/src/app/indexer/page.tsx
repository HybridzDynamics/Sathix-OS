'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RefreshCw, Database, Server, Clock, AlertTriangle } from 'lucide-react';

export default function IndexerPage() {
  const [isIndexing, setIsIndexing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [lastIndexed, setLastIndexed] = React.useState('2 hours ago');
  const [vectorCount, setVectorCount] = React.useState(12400);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const startReindexing = () => {
    setDialogOpen(false);
    setIsIndexing(true);
    setProgress(0);
  };

  React.useEffect(() => {
    if (!isIndexing) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsIndexing(false);
          setLastIndexed('Just now');
          setVectorCount((prevCount) => prevCount + Math.floor(Math.random() * 20) + 5);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isIndexing]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Search Index Controller</h2>
        <p className="text-sm text-slate-500">Manage vector embeddings and search indexing for the RAG scheme matching engine</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <Database className="h-4 w-4 text-emerald-600" />
              Qdrant Vector Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{vectorCount.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">Total indexed scheme vectors</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-600" />
              Index Freshness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{lastIndexed}</div>
            <p className="text-xs text-slate-400 mt-1">Last manual or scheduled sync</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900 text-lg font-bold">Vector Synchronization</CardTitle>
          <CardDescription>
            Re-indexing generates new vector representations of scheme eligibility criteria using the multilingual encoder. 
            This process optimizes matches for search queries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isIndexing ? (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                  Generating Embeddings...
                </span>
                <span className="font-mono text-emerald-600">{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-150" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">Processing batch translation mapping and embedding calculations...</p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3">
              <Server className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800 block mb-0.5">Systems operational</span>
                All vector nodes are online. The indices are currently aligned with the schemes database.
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button 
              disabled={isIndexing}
              onClick={() => setDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Trigger Re-index
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="bg-white border border-slate-200">
                <DialogHeader>
                  <DialogTitle className="text-slate-900 font-bold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Confirm Global Re-indexing?
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-sm">
                    This will recalculate vector embeddings for all {vectorCount.toLocaleString()} items in the system. 
                    During this time, search accuracy might momentarily degrade.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-200 text-slate-700">
                    Cancel
                  </Button>
                  <Button onClick={startReindexing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Proceed
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
