import React from 'react';
import { Scheme, Language } from '../types';
import { SchemeIcon } from './SchemeIcon';

interface RecentlyViewedCardProps {
  scheme: Scheme;
  language: Language;
  onClick: (scheme: Scheme) => void;
}

export const RecentlyViewedCard: React.FC<RecentlyViewedCardProps> = ({
  scheme,
  language,
  onClick,
}) => {
  const isHindi = language === 'hi';
  const title = isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title;

  return (
    <button
      id={`recent-scheme-${scheme.id}`}
      onClick={() => onClick(scheme)}
      className="flex-1 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_2px_12px_rgba(26,35,126,0.04)] hover:shadow-md hover:border-[#2196F3]/30 transition-all flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-[#2196F3]/20"
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        <SchemeIcon iconType={scheme.iconType} className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#1A237E] transition-colors leading-tight line-clamp-2">
          {title}
        </h4>
      </div>
    </button>
  );
};
