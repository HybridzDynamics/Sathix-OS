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
  PieChart, 
  Activity 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070B14] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                GOVERNMENT ADMINISTRATIVE MONITORING DEMO
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Sync Mock</span>
            </div>
            <h1 className="text-3xl font-black text-white mt-1">SathiX OS Analytics & Insights</h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time monitoring of citizen engagement, scheme adoption, language distribution, and DBT disbursals.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-2 rounded-xl">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>National Dashboard Active</span>
          </div>
        </div>

        {/* Top 4 KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#0B101E] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Citizens Served</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-2 font-mono">{MOCK_ADMIN_STATS.totalCitizens}</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% from last month
            </div>
          </div>

          <div className="bg-[#0B101E] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Scheme Applications</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-2 font-mono">{MOCK_ADMIN_STATS.totalApplications}</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 88.4% auto-verified by AI
            </div>
          </div>

          <div className="bg-[#0B101E] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">AI Queries Today</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mt-2 font-mono">{MOCK_ADMIN_STATS.aiQueriesToday}</div>
            <div className="text-[10px] text-cyan-400 mt-1">Avg response time: {MOCK_ADMIN_STATS.avgResponseTime}</div>
          </div>

          <div className="bg-[#0B101E] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">DBT Disbursed Funds</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">{MOCK_ADMIN_STATS.dbtDisbursed}</div>
            <div className="text-[10px] text-emerald-300 mt-1">Direct Bank Account Transfers</div>
          </div>

        </div>

        {/* Charts Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Popular Schemes Category Distribution */}
          <div className="bg-[#0B101E] border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Popular Schemes Application Distribution</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">By Sector</span>
            </div>

            {/* Custom Bar Chart Visual */}
            <div className="space-y-3 pt-2">
              {MOCK_ADMIN_STATS.categoryShare.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat.category}</span>
                    <span className="font-mono text-cyan-400">{cat.count} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Language Analytics Distribution */}
          <div className="bg-[#0B101E] border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Globe2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Language Usage Analytics</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Regional Share</span>
            </div>

            {/* Custom Progress Ring / Segment Visual */}
            <div className="space-y-3 pt-2">
              {MOCK_ADMIN_STATS.languageBreakdown.map((lang, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{lang.language}</span>
                    <span className="font-mono text-purple-400">{lang.count} ({lang.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
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
          
          <div className="bg-[#0B101E] border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <Smile className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">Citizen Satisfaction</h4>
            </div>
            <div className="text-3xl font-black text-amber-400 font-mono">{MOCK_ADMIN_STATS.satisfactionRate}</div>
            <p className="text-xs text-slate-400">
              Based on 450,000+ citizen post-service feedback ratings across 28 states.
            </p>
          </div>

          <div className="bg-[#0B101E] border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">Aadhaar e-KYC Verification Rate</h4>
            </div>
            <div className="text-3xl font-black text-cyan-400 font-mono">99.8%</div>
            <p className="text-xs text-slate-400">
              Zero fraudulent claims detected through AI OCR cross-referencing.
            </p>
          </div>

          <div className="bg-[#0B101E] border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Layers className="w-5 h-5" />
              <h4 className="text-sm font-bold text-white">Average Processing Time</h4>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">3.2 Days</div>
            <p className="text-xs text-slate-400">
              Reduced from traditional 30-day manual physical application cycle.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
