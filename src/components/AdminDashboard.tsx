import React from 'react';
import { MOCK_ADMIN_STATS } from '../data/mockData';
import { 
  BarChart3, 
  Users, 
  FileCheck, 
  MessageSquare, 
  IndianRupee, 
  Smile, 
  TrendingUp, 
  Globe2, 
  ShieldCheck, 
  Layers, 
  Activity 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                GOVERNMENT ADMINISTRATIVE MONITORING
              </span>
              <span className="text-xs text-slate-500 font-mono font-medium">Live Sync</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mt-1">SathiX OS Analytics & Insights</h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Real-time monitoring of citizen engagement, scheme adoption, language distribution, and DBT disbursals.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded-xl">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="font-bold">National Dashboard Active</span>
          </div>
        </div>

        {/* Top 4 KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Citizens Served</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{MOCK_ADMIN_STATS.totalCitizens}</div>
            <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3 h-3" /> +14.2% from last month
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Scheme Applications</span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{MOCK_ADMIN_STATS.totalApplications}</div>
            <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3 h-3" /> 88.4% auto-verified by AI
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Queries Today</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{MOCK_ADMIN_STATS.aiQueriesToday}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">Avg response time: {MOCK_ADMIN_STATS.avgResponseTime}</div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">DBT Disbursed Funds</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">{MOCK_ADMIN_STATS.dbtDisbursed}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">Direct Bank Account Transfers</div>
          </div>

        </div>

        {/* Charts Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Popular Schemes Category Distribution */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Popular Schemes Distribution</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono font-medium">By Sector</span>
            </div>

            {/* Custom Bar Chart Visual */}
            <div className="space-y-3 pt-2">
              {MOCK_ADMIN_STATS.categoryShare.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{cat.category}</span>
                    <span className="font-mono text-slate-900 font-bold">{cat.count} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Language Analytics Distribution */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Globe2 className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Language Usage Analytics</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono font-medium">Regional Share</span>
            </div>

            {/* Custom Progress Ring / Segment Visual */}
            <div className="space-y-3 pt-2">
              {MOCK_ADMIN_STATS.languageBreakdown.map((lang, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{lang.language}</span>
                    <span className="font-mono text-slate-900 font-bold">{lang.count} ({lang.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${lang.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Row: Feedback Overview & Governance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-500">
              <Smile className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900">Citizen Satisfaction</h4>
            </div>
            <div className="text-3xl font-black text-amber-500 font-mono">{MOCK_ADMIN_STATS.satisfactionRate}</div>
            <p className="text-xs text-slate-500 font-medium">
              Based on 450,000+ citizen post-service feedback ratings across 28 states.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900">Aadhaar e-KYC Verification Rate</h4>
            </div>
            <div className="text-3xl font-black text-blue-600 font-mono">99.8%</div>
            <p className="text-xs text-slate-500 font-medium">
              Zero fraudulent claims detected through AI OCR cross-referencing.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-600">
              <Layers className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900">Average Processing Time</h4>
            </div>
            <div className="text-3xl font-black text-emerald-600 font-mono">3.2 Days</div>
            <p className="text-xs text-slate-500 font-medium">
              Reduced from traditional 30-day manual physical application cycle.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
