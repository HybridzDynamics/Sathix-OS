import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  ChevronDown, 
  Check, 
  SquarePen, 
  Volume2, 
  VolumeX, 
  PanelLeft, 
  PanelLeftClose, 
  PanelLeftOpen 
} from 'lucide-react';
import { Language, UserProfile } from '../../types';

interface ChatHeaderProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenProfile: () => void;
  onNewChat?: () => void;
  showNewChat?: boolean;
  audioNarrationActive?: boolean;
  onToggleNarration?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  language,
  onLanguageChange,
  onOpenProfile,
  onNewChat,
  showNewChat = false,
  audioNarrationActive = false,
  onToggleNarration,
  isSidebarOpen = false,
  onToggleSidebar,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full flex items-center justify-between py-3 px-2 sm:px-4 border-b border-slate-100 bg-[#F8F9FA]/90 backdrop-blur-md sticky top-0 z-20">
      {/* Left: Sidebar Toggle & Language Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            id="chat-language-toggle-btn"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-[#1A237E] hover:bg-slate-100/80 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/20"
            title="Change Language / भाषा बदलें"
            aria-haspopup="true"
            aria-expanded={isLangOpen}
          >
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 hover:text-[#1A237E]" />
            <span className="hidden sm:inline text-xs font-semibold text-slate-700 uppercase">
              {language}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:inline ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div 
              id="chat-language-dropdown"
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

      {/* Center: SarthixOS Branding Title */}
      <div className="flex items-center gap-1.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A237E]">
          SarthixOS
        </h1>
      </div>

      {/* Right Controls: Audio Narration, New Chat & Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Voice Narration Guide Toggle */}
        {onToggleNarration && (
          <button
            id="chat-audio-narration-btn"
            onClick={onToggleNarration}
            title={audioNarrationActive ? 'Voice guide active' : 'Enable voice guide for responses'}
            className={`p-2 rounded-full transition-all text-xs flex items-center justify-center border ${
              audioNarrationActive
                ? 'bg-[#2196F3] text-white border-[#2196F3] shadow-xs'
                : 'bg-white text-slate-600 hover:text-[#2196F3] hover:bg-[#E3F2FD] border-slate-200'
            }`}
          >
            {audioNarrationActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}

        {/* New Chat Icon Button */}
        {onNewChat && (
          <button
            id="chat-new-conversation-btn"
            onClick={onNewChat}
            className="p-2 rounded-full text-slate-700 hover:text-[#2196F3] hover:bg-[#E3F2FD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
            title="Start New Chat (+ New Chat)"
          >
            <SquarePen className="w-5 h-5" />
          </button>
        )}

        {/* User Profile Avatar */}
        <button
          id="chat-user-avatar-btn"
          onClick={onOpenProfile}
          className="relative group p-0.5 rounded-full ring-2 ring-transparent hover:ring-[#2196F3] transition-all focus:outline-none"
          title="View Citizen Profile"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-xs bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4CAF50] border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
