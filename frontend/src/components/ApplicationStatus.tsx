import React from 'react';
import { ActiveTab } from '../types';
import { MOCK_APPLICATIONS } from '../data/mockData';
import { CheckCircle2, Clock, Search, Bot } from 'lucide-react';

interface ApplicationStatusProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ setActiveTab }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Application Tracker</h1>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Real-time updates on your submitted government scheme and loan applications.
            </p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Ref ID..." 
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 outline-none transition shadow-sm"
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {MOCK_APPLICATIONS.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 hover:border-slate-300 transition-colors shadow-sm">
              
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left Side: Overview */}
                <div className="md:w-1/3 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {app.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-medium">ID: {app.referenceNumber}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{app.schemeTitle}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Applied: {app.appliedDate}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] text-slate-500 mb-1 font-medium">Expected Benefit</p>
                    <p className="text-sm font-mono font-bold text-emerald-600">{app.benefitAmount}</p>
                  </div>

                  {/* AI Status Explanation */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                    <Bot className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-blue-800 mb-1">AI Status Summary</p>
                      <p className="text-xs text-blue-700 leading-relaxed font-medium">
                        {app.statusText === 'Approved' 
                          ? "Your application is fully approved. The funds have been queued for Direct Benefit Transfer. No further action is required."
                          : app.statusText === 'Field Inspection'
                          ? "Your application passed initial checks and is awaiting a manual field inspection by the local officer. We will notify you once scheduled."
                          : "Your documents are currently being verified by the nodal agency. Sit tight, everything is on track."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Visual Timeline */}
                <div className="md:w-2/3 md:pl-8 md:border-l border-slate-100 relative">
                  <h4 className="text-sm font-bold text-slate-900 mb-6">Progress Timeline</h4>
                  <div className="relative space-y-6">
                    {app.timeline.map((step, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        {/* Connecting Line */}
                        {idx !== app.timeline.length - 1 && (
                          <div className={`absolute left-3 top-8 bottom-[-24px] w-0.5 ${step.completed ? 'bg-blue-200' : 'bg-slate-200'}`}></div>
                        )}
                        
                        {/* Node */}
                        <div className="relative z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            step.completed 
                              ? 'bg-blue-100 border-blue-500 text-blue-600' 
                              : step.active
                              ? 'bg-amber-50 border-amber-500 text-amber-500'
                              : 'bg-white border-slate-300 text-slate-400'
                          }`}>
                            {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.active ? <Clock className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="pb-1">
                          <div className="flex items-center gap-2">
                            <h5 className={`text-sm font-bold ${step.completed ? 'text-slate-900' : step.active ? 'text-amber-600' : 'text-slate-500'}`}>
                              {step.title}
                            </h5>
                            {step.date !== 'Pending' && step.date !== 'In Progress' && (
                              <span className="text-[10px] text-slate-500 font-mono font-medium">{step.date}</span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 font-medium ${step.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
