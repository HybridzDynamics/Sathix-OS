import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Volume2, VolumeX } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../utils/translations';

interface HeaderProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenProfile: () => void;
  audioNarrationActive: boolean;
  onToggleNarration: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  language,
  onLanguageChange,
  onOpenProfile,
  audioNarrationActive,
  onToggleNarration,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[language] || translations.en;

  const languages: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
  ];

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayName = () => {
    if (language === 'hi') return user.nameHindi;
    return user.name.split(' ')[0]; // "Ravi"
  };

  return (
    <header className="w-full flex items-center justify-between pt-4 pb-2 px-1 sm:px-2">
      <div className="flex flex-col">
        <h1 
          id="header-greeting" 
          className="text-2xl sm:text-3xl font-bold text-[#1A237E] tracking-tight"
        >
          {t.greeting}, {getDisplayName()}
        </h1>
        
        {/* Language Dropdown Selector */}
        <div className="relative mt-1" ref={dropdownRef}>
          <button
            id="header-language-toggle-btn"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-[#1A237E] transition-colors py-0.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2196F3]/20"
            aria-haspopup="true"
            aria-expanded={isLangOpen}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {language === 'en' ? 'English / हिंदी' : language === 'hi' ? 'हिंदी / English' : languages.find(l => l.code === language)?.native}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div 
              id="language-dropdown-menu"
              className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_4px_24px_rgba(26,35,126,0.12)] border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Select Language / भाषा चुनें
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm transition-colors text-left ${
                    language === lang.code
                      ? 'bg-[#E3F2FD] text-[#1A237E] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#1A237E]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{lang.native}</span>
                    <span className="text-[11px] text-slate-400 font-normal">{lang.name}</span>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-[#2196F3]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right controls: Accessibility voice reading & Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Audio narration toggle button for low digital literacy users */}
        <button
          id="audio-narration-btn"
          onClick={onToggleNarration}
          title={audioNarrationActive ? 'Turn off Voice Guide' : 'Turn on Voice Guide for low-reading'}
          className={`p-2 rounded-full transition-all text-xs flex items-center gap-1 border ${
            audioNarrationActive
              ? 'bg-[#2196F3] text-white border-[#2196F3] shadow-sm'
              : 'bg-white text-slate-600 hover:text-[#2196F3] hover:bg-[#E3F2FD] border-slate-200'
          }`}
        >
          {audioNarrationActive ? (
            <>
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="hidden md:inline text-[11px] font-medium pr-1">Voice Active</span>
            </>
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* User Profile Avatar with rural citizen photo matching Stitch */}
        <button
          id="header-user-avatar-btn"
          onClick={onOpenProfile}
          className="relative group p-0.5 rounded-full ring-2 ring-transparent hover:ring-[#2196F3] transition-all focus:outline-none"
          title="View Citizen Profile"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback to high quality Indian farmer portrait representation
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          {/* Active status dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
