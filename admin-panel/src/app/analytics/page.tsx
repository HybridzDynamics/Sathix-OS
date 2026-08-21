'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ApiError } from '@/services/api';
import { getAnalytics, type AnalyticsData } from '@/services/analytics';

const COLORS = ['#059669', '#0F172A', '#3b82f6', '#eab308', '#ec4899', '#64748B'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((cause) => setError(cause instanceof ApiError ? cause.message : 'Unable to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading analytics…</p>;
  if (error) return <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>;
  if (!data) return null;

  const applicationData = data.applications.map((row) => ({ status: row.status.replace('_', ' '), count: row.count }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Analytics Insights</h2>
        <p className="text-sm text-slate-500">
          Live metrics from PostgreSQL · {data.totals.userQueriesLast7Days} citizen queries in the last 7 days
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">Schemes by State</CardTitle>
            <CardDescription>Active schemes grouped by jurisdiction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.schemesByState.slice(0, 10)} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="state" type="category" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#059669" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">User Language Preference</CardTitle>
            <CardDescription>Registered user language distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-[250px] w-[250px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.languageDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {data.languageDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full max-w-[200px]">
              {data.languageDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-500 font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">Citizen Query Volume (7 days)</CardTitle>
            <CardDescription>User chat messages recorded in Backend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.queryVolume}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line type="monotone" name="User Queries" dataKey="total" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">Applications by Status</CardTitle>
            <CardDescription>Citizen application pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="status" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">Scraper Job Status</CardTitle>
            <CardDescription>Current scraper queue breakdown</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(data.scraperJobs).map(([status, count]) => (
              <div key={status} className="rounded border bg-slate-50 p-3">
                <div className="text-slate-500 text-xs uppercase">{status}</div>
                <div className="text-2xl font-bold text-slate-900">{count}</div>
              </div>
            ))}
            {Object.keys(data.scraperJobs).length === 0 && <p className="text-slate-600 col-span-2">No scraper jobs recorded yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
