import React, { useState } from 'react';
import { Scheme, Language } from '../../types';
import { SchemeCard } from '../SchemeCard';
import { SearchBar } from '../SearchBar';
import { translations } from '../../utils/translations';
import { Filter, Sparkles, CheckCircle2 } from 'lucide-react';

interface ExploreViewProps {
  schemes: Scheme[];
  language: Language;
  onApplyScheme: (scheme: Scheme) => void;
  onViewSchemeDetails: (scheme: Scheme) => void;
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onOpenVoiceSearch: () => void;
  voiceEnabled?: boolean;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  schemes,
  language,
  onApplyScheme,
  onViewSchemeDetails,
  savedSchemeIds,
  onToggleSaveScheme,
  onOpenVoiceSearch,
  voiceEnabled = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[language] || translations.en;

  const categories = [
    { id: 'all', label: 'All Schemes', labelHi: 'सभी योजनाएं' },
    { id: 'agriculture', label: '🌾 Agriculture', labelHi: '🌾 कृषि' },
    { id: 'health', label: '🏥 Health', labelHi: '🏥 स्वास्थ्य' },
    { id: 'housing', label: '🏠 Housing', labelHi: '🏠 आवास' },
    { id: 'banking', label: '🏦 Banking & DBT', labelHi: '🏦 बैंकिंग' },
    { id: 'women', label: '👩 Women & Child', labelHi: '👩 महिला कल्याण' },
    { id: 'energy', label: '⚡ Clean Energy', labelHi: '⚡ सौर ऊर्जा' },
    { id: 'employment', label: '🔨 Employment', labelHi: '🔨 रोजगार' },
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleHindi.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-16">
      {/* Header */}
      <div className="pt-2 px-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A237E] tracking-tight">
          {language === 'hi' ? 'सरकारी योजनाएं खोजें' : 'Explore All Schemes'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {language === 'hi' ? 'केंद्र व राज्य सरकार की 100+ कल्याणकारी योजनाएं' : 'Browse central & state welfare schemes personalized for your eligibility'}
        </p>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onVoiceClick={onOpenVoiceSearch}
        language={language}
        onClear={() => setSearchQuery('')}
        voiceEnabled={voiceEnabled}
      />

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#2196F3] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80 hover:text-[#1A237E]'
            }`}
          >
            {language === 'hi' ? cat.labelHi : cat.label}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              language={language}
              onApply={onApplyScheme}
              onViewDetails={onViewSchemeDetails}
              isSaved={savedSchemeIds.includes(scheme.id)}
              onToggleSave={onToggleSaveScheme}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-xs">
            <p className="text-slate-500 text-sm">No schemes found in this category.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 px-4 py-2 bg-[#E3F2FD] text-[#2196F3] rounded-xl text-xs font-semibold hover:bg-[#BBDEFB] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
