import React from 'react';
import { Scheme, Language } from '../../types';
import { SchemeCard } from '../SchemeCard';
import { Bookmark, Compass } from 'lucide-react';
import { translations } from '../../utils/translations';

interface SavedViewProps {
  schemes: Scheme[];
  savedIds: string[];
  language: Language;
  onApplyScheme: (scheme: Scheme) => void;
  onViewSchemeDetails: (scheme: Scheme) => void;
  onToggleSaveScheme: (schemeId: string) => void;
  onNavigateToExplore: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  schemes,
  savedIds,
  language,
  onApplyScheme,
  onViewSchemeDetails,
  onToggleSaveScheme,
  onNavigateToExplore,
}) => {
  const t = translations[language] || translations.en;
  const savedSchemes = schemes.filter(s => savedIds.includes(s.id));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-16">
      {/* Header */}
      <div className="pt-2 px-1 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A237E] tracking-tight">
            {t.savedSchemes} ({savedSchemes.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'hi' ? 'भविष्य में आवेदन करने के लिए बुकमार्क की गई योजनाएं' : 'Schemes you bookmarked for later application & offline access'}
          </p>
        </div>
      </div>

      {/* Grid */}
      {savedSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              language={language}
              onApply={onApplyScheme}
              onViewDetails={onViewSchemeDetails}
              isSaved={true}
              onToggleSave={onToggleSaveScheme}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-[0_2px_12px_rgba(26,35,126,0.04)] max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1A237E]">No Saved Schemes Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Tap the bookmark icon on any government scheme card to save it here for quick access.
          </p>
          <button
            onClick={onNavigateToExplore}
            className="px-5 py-2.5 bg-[#2196F3] hover:bg-[#1E88E5] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Schemes</span>
          </button>
        </div>
      )}
    </div>
  );
};
