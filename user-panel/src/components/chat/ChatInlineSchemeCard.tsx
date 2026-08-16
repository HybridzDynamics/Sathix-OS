import React from 'react';
import { Scheme, Language } from '../../types';
import { SchemeIcon } from '../SchemeIcon';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface ChatInlineSchemeCardProps {
  scheme: Scheme;
  language: Language;
  onViewDetails: (scheme: Scheme) => void;
  onApply?: (scheme: Scheme) => void;
}

export const ChatInlineSchemeCard: React.FC<ChatInlineSchemeCardProps> = ({
  scheme,
  language,
  onViewDetails,
}) => {
  const isHindi = language === 'hi';
  const title = isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title;
  const subtitle = isHindi && scheme.subtitleHindi ? scheme.subtitleHindi : scheme.subtitle;

  // Custom icon colors matching design
  const iconBg = scheme.iconBgColor || 'bg-[#E3F2FD]';
  const iconColor = scheme.iconColor || 'text-[#2196F3]';

  return (
    <div 
      id={`chat-inline-scheme-${scheme.id}`}
      onClick={() => onViewDetails(scheme)}
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_14px_rgba(26,35,126,0.05)] hover:shadow-[0_6px_20px_rgba(26,35,126,0.09)] hover:border-[#2196F3]/40 transition-all text-left flex flex-col justify-between group cursor-pointer"
    >
      {/* Top row: Icon + Title & Match Badge */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
              <SchemeIcon iconType={scheme.iconType} className="w-5 h-5" />
            </div>
            
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-[#1A237E] leading-snug group-hover:text-[#2196F3] transition-colors truncate">
                {title}
              </h4>
              <span className="text-[11px] text-slate-500 font-medium line-clamp-1">
                {scheme.categoryLabel}
              </span>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1A237E] text-white text-[11px] font-bold shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-[#4CAF50]" />
            <span>{scheme.matchPercentage}% Match</span>
          </div>
        </div>

        {/* Scheme description / benefits */}
        <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed line-clamp-2">
          {subtitle || scheme.description}
        </p>
      </div>

      {/* Bottom action: View Details link */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-[#1A237E]">
          {scheme.benefitAmount || 'Direct Benefit Transfer'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(scheme);
          }}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#2196F3] hover:text-[#1976D2] transition-colors group-hover:translate-x-0.5 duration-150 focus:outline-none"
        >
          <span>{isHindi ? 'विवरण देखें' : 'View Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
