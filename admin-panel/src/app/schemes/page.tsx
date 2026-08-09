'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { mockSchemes, Scheme } from '@/lib/mock-data/schemes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SchemesPage() {
  const [data, setData] = React.useState<Scheme[]>(mockSchemes);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedState, setSelectedState] = React.useState('');
  const [selectedDept, setSelectedDept] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');

  // Extract unique filter items
  const uniqueStates = React.useMemo(() => {
    return Array.from(new Set(mockSchemes.map((s) => s.state)));
  }, []);

  const uniqueDepts = React.useMemo(() => {
    return Array.from(new Set(mockSchemes.map((s) => s.department)));
  }, []);

  // Filter logic
  React.useEffect(() => {
    let filtered = mockSchemes;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter((s) => s.state === selectedState);
    }

    if (selectedDept) {
      filtered = filtered.filter((s) => s.department === selectedDept);
    }

    if (selectedStatus) {
      filtered = filtered.filter((s) => s.status === selectedStatus);
    }

    setData(filtered);
  }, [searchTerm, selectedState, selectedDept, selectedStatus]);

  // Column definitions
  const columns: ColumnDef<Scheme>[] = [
    {
      accessorKey: 'name',
      header: 'Scheme Name',
      cell: ({ row }) => <span className="font-medium text-slate-900">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'state',
      header: 'State / Level',
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-slate-100 border-slate-200 text-slate-700">
          {row.getValue('state')}
        </Badge>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        let badgeStyle = 'bg-emerald-500 hover:bg-emerald-600 text-white';
        if (status === 'Draft') {
          badgeStyle = 'bg-yellow-500 hover:bg-yellow-600 text-white';
        } else if (status === 'Archived') {
          badgeStyle = 'bg-slate-500 hover:bg-slate-600 text-white';
        }
        return <Badge className={badgeStyle}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'lastUpdated',
      header: 'Last Updated',
    },
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 text-lg font-bold">Government Schemes</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search scheme name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="w-full md:w-40">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="">All States</option>
              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-40">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="">All Depts</option>
              {uniqueDepts.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="Live">Live</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
