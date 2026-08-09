'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { mockLogs, SystemLog } from '@/lib/mock-data/logs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LogsPage() {
  const [data, setData] = React.useState<SystemLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState('');
  const [selectedSource, setSelectedSource] = React.useState('');

  const uniqueSources = React.useMemo(() => {
    return Array.from(new Set(mockLogs.map(l => l.source)));
  }, []);

  React.useEffect(() => {
    let filtered = mockLogs;

    if (searchTerm) {
      filtered = filtered.filter(l => 
        l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel) {
      filtered = filtered.filter(l => l.level === selectedLevel);
    }

    if (selectedSource) {
      filtered = filtered.filter(l => l.source === selectedSource);
    }

    setData(filtered);
  }, [searchTerm, selectedLevel, selectedSource]);

  const columns: ColumnDef<SystemLog>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => <span className="font-mono text-xs text-slate-500">{row.getValue('timestamp')}</span>
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => {
        const level = row.getValue('level') as string;
        let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (level === 'Warning') {
          badgeStyle = 'bg-yellow-50 text-yellow-700 border-yellow-200';
        } else if (level === 'Error') {
          badgeStyle = 'bg-red-50 text-red-700 border-red-200';
        }
        return <Badge variant="outline" className={badgeStyle}>{level}</Badge>;
      }
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 font-mono text-xs">{row.getValue('source')}</Badge>
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.getValue('message')}</span>
    }
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 text-lg font-bold">System Operations Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Search logs message or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="w-full md:w-44">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="">All Levels</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Error">Error</option>
            </select>
          </div>
          <div className="w-full md:w-44">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="">All Sources</option>
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
