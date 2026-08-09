'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { mockSources, Source } from '@/lib/mock-data/sources';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Globe, Settings, ExternalLink } from 'lucide-react';

export default function SourcesPage() {
  const [sources, setSources] = React.useState<Source[]>(mockSources);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // Form State
  const [name, setName] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [stateMinistry, setStateMinistry] = React.useState('');
  const [status, setStatus] = React.useState<'Active' | 'Paused'>('Active');

  const filteredSources = React.useMemo(() => {
    return sources.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.stateMinistry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sources, searchTerm]);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !stateMinistry) return;

    const newSource: Source = {
      id: String(sources.length + 1),
      name,
      url,
      stateMinistry,
      status,
      lastScraped: new Date().toISOString(),
    };

    setSources((prev) => [newSource, ...prev]);
    setIsAddOpen(false);

    // Reset Form
    setName('');
    setUrl('');
    setStateMinistry('');
    setStatus('Active');
  };

  const handleDelete = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setSources((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: s.status === 'Active' ? 'Paused' : 'Active',
          };
        }
        return s;
      })
    );
  };

  const columns: ColumnDef<Source>[] = [
    {
      accessorKey: 'name',
      header: 'Source Name',
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.getValue('name')}</span>
      ),
    },
    {
      accessorKey: 'url',
      header: 'Source URL',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-500 max-w-xs truncate">
          <Globe className="h-4 w-4 shrink-0 text-slate-400" />
          <a href={row.getValue('url')} target="_blank" rel="noopener noreferrer" className="truncate hover:underline hover:text-emerald-600 transition-colors">
            {row.getValue('url')}
          </a>
        </div>
      ),
    },
    {
      accessorKey: 'stateMinistry',
      header: 'State / Ministry',
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
          {row.getValue('stateMinistry')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const sourceStatus = row.getValue('status') as string;
        return (
          <Badge
            onClick={() => handleToggleStatus(row.original.id)}
            className={`cursor-pointer transition-all ${
              sourceStatus === 'Active'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {sourceStatus}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'lastScraped',
      header: 'Last Scraped',
      cell: ({ row }) => (
        <span className="text-slate-500 text-xs font-mono">
          {row.getValue('lastScraped') ? new Date(row.getValue('lastScraped')).toLocaleString() : 'Never'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 hover:text-slate-900"
            onClick={() => handleToggleStatus(row.original.id)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-slate-900 text-lg font-bold">Scraper Target Sources</CardTitle>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Source
        </Button>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Filter sources by name, URL, or jurisdiction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
          />
        </div>

        {/* DataTable */}
        <DataTable columns={columns} data={filteredSources} />

        {/* Add Source Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="bg-white border border-slate-200 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-slate-900 font-bold">Register New Scheme Source</DialogTitle>
              <DialogDescription className="text-slate-500 text-sm">
                Add a new federal ministry website or state portal to the automated scraping schedule.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSource} className="space-y-4 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Source Name</label>
                <Input
                  required
                  placeholder="e.g. Ministry of Electronics and IT"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Source URL</label>
                <Input
                  required
                  type="url"
                  placeholder="e.g. https://www.meity.gov.in"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">State / Ministry</label>
                <Input
                  required
                  placeholder="e.g. Central, Gujarat, Tamil Nadu"
                  value={stateMinistry}
                  onChange={(e) => setStateMinistry(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Paused')}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                >
                  <option value="Active">Active (Scrape immediately)</option>
                  <option value="Paused">Paused (On Hold)</option>
                </select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="border-slate-200 text-slate-700">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Register Source
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
