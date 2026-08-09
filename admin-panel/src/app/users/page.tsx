'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { mockUsers, User } from '@/lib/mock-data/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  const [data, setData] = React.useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedState, setSelectedState] = React.useState('');
  const [selectedLanguage, setSelectedLanguage] = React.useState('');

  // Extract unique states and languages for filters
  const uniqueStates = React.useMemo(() => {
    return Array.from(new Set(mockUsers.map((u) => u.state)));
  }, []);

  const uniqueLanguages = React.useMemo(() => {
    return Array.from(new Set(mockUsers.map((u) => u.preferredLanguage)));
  }, []);

  // Filter logic
  React.useEffect(() => {
    let filtered = mockUsers;

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.phone.includes(searchTerm)
      );
    }

    if (selectedState) {
      filtered = filtered.filter((u) => u.state === selectedState);
    }

    if (selectedLanguage) {
      filtered = filtered.filter((u) => u.preferredLanguage === selectedLanguage);
    }

    setData(filtered);
  }, [searchTerm, selectedState, selectedLanguage]);

  // Column definitions for TanStack Table
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium text-slate-900">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Contact Info',
      cell: ({ row }) => (
        <div className="flex flex-col text-sm">
          <span className="text-slate-900">{row.getValue('email')}</span>
          <span className="text-slate-500 text-xs">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: 'state',
      header: 'State',
    },
    {
      accessorKey: 'preferredLanguage',
      header: 'Language',
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-slate-100 border-slate-200 text-slate-700">
          {row.getValue('preferredLanguage')}
        </Badge>
      ),
    },
    {
      accessorKey: 'joinedDate',
      header: 'Joined Date',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            className={
              status === 'Active'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 text-lg font-bold">Registered Users</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="w-full md:w-48">
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
          <div className="w-full md:w-48">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="">All Languages</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reusable Data Table */}
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
