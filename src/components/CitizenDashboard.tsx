import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  MOCK_CITIZEN, 
  MOCK_APPLICATIONS, 
  MOCK_DOCUMENTS, 
  MOCK_SCHEMES 
} from '../data/mockData';
import { 
  User, 
  ShieldCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  Bookmark, 
  ArrowUpRight, 
  Plus, 
  ChevronRight, 
  Building, 
  CreditCard,
  Search,
  ExternalLink
} from 'lucide-react';

interface CitizenDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ setActiveTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'documents' | 'saved' | 'notifications'>('applications');
  const [selectedApp, setSelectedApp] = useState(MOCK_APPLICATIONS[0]);

  const notifications = [
    {
      id: 'n1',
      title: 'PM-KISAN Installment Disbursal Alert',
      desc: 'Your 17th installment of ₹2,000 is scheduled for auto-credit on 15th August 2026.',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 'n2',
      title: 'Ayushman Card Verification Update',
      desc: 'Chief Medical Officer Varanasi has approved your family tree document.',
      time: '1 day ago',
      type: 'info'
    },
    {
      id: 'n3',
      title: 'PMAY Housing Site Inspection',
      desc: 'Gram Panchayat Officer will visit Shivpur plot for photo verification tomorrow.',
      time: '3 days ago',
      type: 'warning'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Card Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B132B] to-[#121E3D] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Avatar & Identity */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20">
                  <div className="w-full h-full bg-[#080D1A] rounded-[14px] flex items-center justify-center">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-[#0B132B]" title="Verified Aadhaar Citizen">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{MOCK_CITIZEN.name}</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    VERIFIED CITIZEN
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {MOCK_CITIZEN.occupation} • {MOCK_CITIZEN.district}, {MOCK_CITIZEN.state}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-slate-400">
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Aadhaar: {MOCK_CITIZEN.aadhaarNumber}</span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Category: {MOCK_CITIZEN.category}</span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Income: {MOCK_CITIZEN.annualIncome}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('assistant')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-300 transition flex items-center space-x-2"
              >
                <span>Ask AI Assistant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('schemes')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-white font-bold text-xs hover:border-cyan-400 transition flex items-center space-x-2"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Find New Schemes</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'applications'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Applications Tracker ({MOCK_APPLICATIONS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('documents')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'documents'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Vault ({MOCK_DOCUMENTS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'notifications'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeSubTab === 'saved'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Schemes</span>
          </button>
        </div>

        {/* View 1: Applications Tracker */}
        {activeSubTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Applications List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Submitted Welfare Applications
              </h3>
              {MOCK_APPLICATIONS.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    selectedApp.id === app.id
                      ? 'bg-[#0E172C] border-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-[#090D18] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{app.referenceNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      app.statusText === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {app.statusText}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5">{app.schemeTitle}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">{app.benefitAmount}</p>
                  <div className="text-[10px] text-slate-500 mt-2">Applied on: {app.appliedDate}</div>
                </div>
              ))}
            </div>

            {/* Selected Application Timeline View */}
            <div className="lg:col-span-2 bg-[#090D19] border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-xs text-cyan-400 font-mono">Ref: {selectedApp.referenceNumber}</span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{selectedApp.schemeTitle}</h2>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Benefit Value</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">{selectedApp.benefitAmount}</div>
                </div>
              </div>

              {/* Step Timeline */}
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                Real-Time Verification Timeline
              </h4>

              <div className="relative border-l-2 border-cyan-500/30 ml-4 space-y-8 pb-4">
                {selectedApp.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    
                    {/* Node Dot */}
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      step.completed 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : step.active
                        ? 'bg-cyan-400 border-cyan-300 animate-ping'
                        : 'bg-slate-900 border-slate-700'
                    }`}>
                    </div>

                    <div className="flex items-center justify-between">
                      <h5 className={`text-sm font-bold ${step.completed || step.active ? 'text-white' : 'text-slate-500'}`}>
                        {step.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 font-mono">{step.date}</span>
                    </div>

                    {step.description && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button 
                  onClick={() => setActiveTab('assistant')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold"
                >
                  Ask AI About Status
                </button>
              </div>

            </div>

          </div>
        )}

        {/* View 2: Document Vault */}
        {activeSubTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Your DigiLocker & SathiX Verified Documents</h3>
              <button 
                onClick={() => setActiveTab('assistant')}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold border border-cyan-500/30 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_DOCUMENTS.map((doc) => (
                <div key={doc.id} className="bg-[#090D18] border border-slate-800 hover:border-cyan-500/40 p-4 rounded-2xl transition">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {doc.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-3">{doc.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{doc.type}</p>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-4 border-t border-slate-800/80 pt-2">
                    <span>Uploaded: {doc.uploadDate}</span>
                    <span>Size: {doc.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 3: Notifications Center */}
        {activeSubTab === 'notifications' && (
          <div className="space-y-3 max-w-3xl">
            <h3 className="text-sm font-bold text-white mb-2">Government DBT Alerts & Direct Notifications</h3>
            {notifications.map((n) => (
              <div key={n.id} className="bg-[#090D18] border border-slate-800 p-4 rounded-2xl flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View 4: Saved Schemes */}
        {activeSubTab === 'saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SCHEMES.slice(0, 3).map((sch) => (
              <div key={sch.id} className="bg-[#090D18] border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{sch.category}</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{sch.benefitAmount}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{sch.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{sch.description}</p>
                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => setActiveTab('schemes')}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30"
                  >
                    View Scheme Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
