import React from 'react';
import { CheckCircle2, Bookmark, ArrowRight, Sparkles } from 'lucide-react';
import { Scheme, Language } from '../types';
import { SchemeIcon } from './SchemeIcon';
import { translations } from '../utils/translations';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  onApply: (scheme: Scheme) => void;
  onViewDetails: (scheme: Scheme) => void;
  isSaved?: boolean;
  onToggleSave?: (schemeId: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  language,
  onApply,
  onViewDetails,
  isSaved = false,
  onToggleSave,
}) => {
  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  const title = isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title;
  const subtitle = isHindi && scheme.subtitleHindi ? scheme.subtitleHindi : scheme.subtitle;

  // Background tint for icons matching Stitch design
  const iconBg = scheme.iconBgColor || 'bg-[#E3F2FD]';
  const iconColor = scheme.iconColor || 'text-[#2196F3]';

  return (
    <div 
      id={`scheme-card-${scheme.id}`}
      onClick={() => onViewDetails(scheme)}
      className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_24px_rgba(26,35,126,0.04)] hover:shadow-[0_8px_30px_rgba(26,35,126,0.09)] hover:border-[#2196F3]/40 transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      {/* Top row: Icon on left, Match percentage badge & bookmark on right */}
      <div>
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
            <SchemeIcon iconType={scheme.iconType} className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            {/* Match Badge */}
            <div 
              id={`match-badge-${scheme.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E3F2FD] border border-[#BBDEFB] text-[#1565C0] text-xs font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2196F3]" />
              <span>{scheme.matchPercentage}% {t.matchScore}</span>
            </div>

            {/* Optional Bookmark button */}
            {onToggleSave && (
              <button
                id={`save-btn-${scheme.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(scheme.id);
                }}
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved ? 'text-[#2196F3] bg-[#E3F2FD]' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Remove from Saved' : 'Save Scheme'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Scheme Title & Subtitle */}
        <div className="mt-4">
          <h3 className="text-lg sm:text-xl font-bold text-[#1A237E] leading-snug group-hover:text-[#2196F3] transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Action Row: Benefit amount & Details Button */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-[#1A237E]">
          {scheme.benefitAmount}
        </span>

        <button
          id={`view-details-btn-${scheme.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(scheme);
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2196F3] hover:text-[#1976D2] group-hover:translate-x-0.5 transition-all"
        >
          <span>{isHindi ? 'विवरण देखें' : 'View Details'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
