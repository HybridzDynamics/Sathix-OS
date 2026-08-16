import React from 'react';
import { Clock, CheckCircle, Bookmark, ChevronRight, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface StatusOverviewProps {
  pendingCount: number;
  approvedCount: number;
  savedCount: number;
  language: Language;
  onNavigateToApplications: () => void;
  onNavigateToSaved: () => void;
}

export const StatusOverview: React.FC<StatusOverviewProps> = ({
  pendingCount,
  approvedCount,
  savedCount,
  language,
  onNavigateToApplications,
  onNavigateToSaved,
}) => {
  const t = translations[language] || translations.en;

  return (
    <div className="w-full space-y-3">
      {/* Top 2 Status Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Pending Card */}
        <button
          id="status-card-pending"
          onClick={onNavigateToApplications}
          className="group text-left bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 border-l-[5px] border-l-[#FFC107] shadow-[0_2px_12px_rgba(26,35,126,0.04)] hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#FFC107]/20"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Clock className="w-4 h-4 text-[#FFA000] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wider uppercase">
              {t.pending}
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#FFA000] group-hover:scale-105 transition-transform inline-block">
            {pendingCount}
          </div>
        </button>

        {/* Approved Card */}
        <button
          id="status-card-approved"
          onClick={onNavigateToApplications}
          className="group text-left bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 border-l-[5px] border-l-[#4CAF50] shadow-[0_2px_12px_rgba(26,35,126,0.04)] hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CheckCircle className="w-4 h-4 text-[#4CAF50] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wider uppercase">
              {t.approved}
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#4CAF50] group-hover:scale-105 transition-transform inline-block">
            {approvedCount}
          </div>
        </button>
      </div>

      {/* Saved Schemes Banner */}
      <button
        id="status-card-saved"
        onClick={onNavigateToSaved}
        className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_2px_12px_rgba(26,35,126,0.04)] hover:shadow-md hover:border-[#2196F3]/30 transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-[#2196F3]/20"
      >
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-none">
              {savedCount}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {t.savedSchemes}
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#2196F3] group-hover:translate-x-0.5 transition-all mr-1" />
      </button>
    </div>
  );
};
