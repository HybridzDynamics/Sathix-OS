'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Globe, TrendingUp, HelpCircle } from 'lucide-react';

const stateData = [
  { state: 'Central', count: 32 },
  { state: 'Gujarat', count: 18 },
  { state: 'Uttar Pradesh', count: 24 },
  { state: 'Tamil Nadu', count: 21 },
  { state: 'Maharashtra', count: 15 },
  { state: 'Punjab', count: 8 },
  { state: 'Andhra Pradesh', count: 12 },
];

const queryVolumeData = [
  { date: 'Aug 03', total: 1240, matched: 820 },
  { date: 'Aug 04', total: 1450, matched: 980 },
  { date: 'Aug 05', total: 1320, matched: 890 },
  { date: 'Aug 06', total: 1680, matched: 1150 },
  { date: 'Aug 07', total: 1890, matched: 1320 },
  { date: 'Aug 08', total: 2100, matched: 1480 },
  { date: 'Aug 09', total: 2450, matched: 1720 },
];

const languageData = [
  { name: 'Hindi', value: 45 },
  { name: 'English', value: 20 },
  { name: 'Tamil', value: 12 },
  { name: 'Bengali', value: 8 },
  { name: 'Telugu', value: 7 },
  { name: 'Others', value: 8 },
];

const COLORS = ['#059669', '#0F172A', '#3b82f6', '#eab308', '#ec4899', '#64748B'];

const matchRateData = [
  { range: '0-20%', count: 120 },
  { range: '21-40%', count: 280 },
  { range: '41-60%', count: 840 },
  { range: '61-80%', count: 1450 },
  { range: '81-100%', count: 920 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Analytics Insights</h2>
        <p className="text-sm text-slate-500">Multilingual search queries, user distribution, and eligibility matching performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* State Bar Chart */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">Schemes by State / Jurisdiction</CardTitle>
            <CardDescription>Distribution of crawled schemes active in the SarthixOS catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="state" type="category" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#059669" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Language Usage Breakdown Pie Chart */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">Language Preference Share</CardTitle>
            <CardDescription>Active user base preferred language distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-[250px] w-[250px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 w-full max-w-[200px]">
              {languageData.map((item, index) => (
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

        {/* Query Volume and Eligibility Match Line Chart */}
        <Card className="border-slate-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">Query Volume & Successful Eligibility Matches</CardTitle>
            <CardDescription>Daily comparison of total incoming citizen queries vs successful scheme eligibility matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={queryVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line type="monotone" name="Total Queries" dataKey="total" stroke="#0F172A" strokeWidth={2.5} dot={{ fill: '#0F172A' }} />
                  <Line type="monotone" name="Matched Schemes" dataKey="matched" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Match Rate Distribution Chart */}
        <Card className="border-slate-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-950 font-bold">Eligibility Match Confidence Distribution</CardTitle>
            <CardDescription>Matching profile scores returned by the RAG search matching vector query</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matchRateData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="range" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#F1F5F9' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
