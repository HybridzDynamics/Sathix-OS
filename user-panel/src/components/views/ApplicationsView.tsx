import React, { useState } from 'react';
import { Application, Language } from '../../types';
import { Clock, CheckCircle2, AlertCircle, FileText, ChevronRight, Download, Check, Info } from 'lucide-react';
import { translations } from '../../utils/translations';

interface ApplicationsViewProps {
  applications: Application[];
  language: Language;
  onViewSchemeDetailsById: (schemeId: string) => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  language,
  onViewSchemeDetailsById,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [downloadedRef, setDownloadedRef] = useState<string | null>(null);
  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  const filteredApps = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const handleDownload = (ref: string) => {
    setDownloadedRef(ref);
    setTimeout(() => setDownloadedRef(null), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16">
      {/* Page Title */}
      <div className="pt-2 px-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A237E] tracking-tight">
          {t.applicationsStatus}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isHindi ? 'अपने सभी सरकारी योजना आवेदनों की वास्तविक स्थिति ट्रैक करें' : 'Track real-time progress and verification stages of your applications'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all' ? 'bg-[#1A237E] text-white shadow-xs' : 'text-slate-600 hover:text-[#1A237E]'
          }`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'pending' ? 'bg-[#FFC107] text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-[#FFA000]'
          }`}
        >
          Pending ({applications.filter(a => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'approved' ? 'bg-[#4CAF50] text-white font-bold shadow-xs' : 'text-slate-600 hover:text-[#4CAF50]'
          }`}
        >
          Approved ({applications.filter(a => a.status === 'approved').length})
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.map((app) => {
          const isPending = app.status === 'pending';
          const isApproved = app.status === 'approved';
          const title = isHindi && app.schemeTitleHindi ? app.schemeTitleHindi : app.schemeTitle;
          const statusDesc = isHindi && app.statusDescriptionHindi ? app.statusDescriptionHindi : app.statusDescription;

          return (
            <div
              key={app.id}
              id={`application-item-${app.id}`}
              className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-[0_2px_12px_rgba(26,35,126,0.04)] transition-all ${
                isPending ? 'border-l-[6px] border-l-[#FFC107] border-slate-100' : 'border-l-[6px] border-l-[#4CAF50] border-slate-100'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isPending ? 'bg-amber-50 text-amber-800 border border-[#FFC107]/50' : 'bg-emerald-50 text-emerald-800 border border-[#4CAF50]/50'
                    }`}>
                      {isPending ? <Clock className="w-3.5 h-3.5 text-[#FFA000]" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" />}
                      <span>{isPending ? t.pending : t.approved}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: {app.referenceNumber}
                    </span>
                  </div>
                  
                  <div 
                    onClick={() => onViewSchemeDetailsById(app.schemeId)}
                    className="cursor-pointer group flex items-center gap-1.5 mt-1"
                  >
                    <h3 className="text-lg font-bold text-[#1A237E] group-hover:text-[#2196F3] transition-colors">
                      {title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2196F3] transition-colors" />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => onViewSchemeDetailsById(app.schemeId)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#E3F2FD] hover:text-[#2196F3] text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-[#2196F3]" />
                    <span>View Scheme</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(app.referenceNumber)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#E3F2FD] hover:text-[#2196F3] text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
                  >
                    {downloadedRef === app.referenceNumber ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#4CAF50]" />
                        <span className="text-[#4CAF50]">Receipt Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-[#2196F3]" />
                        <span>Download Acknowledgment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Message */}
              <div className="py-3">
                <p className="text-sm font-medium text-slate-700">
                  {statusDesc}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.appliedOn}: {app.appliedDate}
                </p>
              </div>

              {/* Progress Timeline */}
              <div className="mt-2 pt-3 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-400 mb-3">
                  Verification Milestones (Step {app.currentStep} of {app.totalSteps})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {app.timeline.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border text-xs flex flex-col justify-between ${
                        step.completed
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : step.current
                          ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                          : 'bg-slate-50 border-slate-200/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px]">Step {idx + 1}</span>
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                        ) : step.current ? (
                          <Clock className="w-4 h-4 text-[#FFA000] animate-pulse" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"></span>
                        )}
                      </div>
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-[10px] opacity-75 mt-1 font-mono">{step.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
