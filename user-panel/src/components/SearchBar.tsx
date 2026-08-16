import React from 'react';
import { Search, Mic, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onVoiceClick: () => void;
  language: Language;
  onClear?: () => void;
  voiceEnabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onVoiceClick,
  language,
  onClear,
  voiceEnabled = true,
}) => {
  const t = translations[language] || translations.en;

  return (
    <div className="w-full my-3">
      <div 
        id="main-search-container"
        className="relative flex items-center bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-[0_2px_12px_rgba(26,35,126,0.05)] hover:border-[#2196F3]/40 transition-all px-3.5 py-2.5 sm:py-3 focus-within:ring-2 focus-within:ring-[#2196F3]/30 focus-within:border-[#2196F3]"
      >
        <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
        
        <input
          id="scheme-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm sm:text-base px-3 focus:outline-none focus:ring-0"
        />

        {value && (
          <button
            id="clear-search-btn"
            onClick={onClear || (() => onChange(''))}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 mr-1 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Search / AI Assistant trigger button */}
        {voiceEnabled && (
          <button
            id="voice-search-btn"
            type="button"
            onClick={onVoiceClick}
            className="p-2 sm:p-2.5 rounded-full bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#2196F3] transition-all hover:scale-105 active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
            title="Voice Search (बोलकर खोजें)"
            aria-label="Voice Search"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-[#2196F3]" />
          </button>
        )}
      </div>
    </div>
  );
};
