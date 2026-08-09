import React, { useState, useEffect } from 'react';
import { ActiveTab, LanguageOption } from '../types';
import { MOCK_LANGUAGES } from '../data/mockData';
import { 
  Bot, 
  Search, 
  User, 
  SlidersHorizontal, 
  BarChart3, 
  Home, 
  Sparkles, 
  Eye, 
  Clock, 
  Languages, 
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
  highContrast: boolean;
  setHighContrast: (hc: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeLanguage,
  setActiveLanguage,
  highContrast,
  setHighContrast,
}) => {
  const [time, setTime] = useState<string>('');
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.FC<any>; badge?: string }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'AI OS' },
    { id: 'schemes', label: 'Scheme Explorer', icon: Search },
    { id: 'dashboard', label: 'Citizen Portal', icon: User, badge: 'Ramesh' },
    { id: 'accessibility', label: 'Accessibility', icon: SlidersHorizontal },
    { id: 'admin', label: 'Gov Analytics', icon: BarChart3, badge: 'Mock' },
  ];

  const currentLangObj = MOCK_LANGUAGES.find(l => l.code === activeLanguage) || MOCK_LANGUAGES[0];

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
      highContrast 
        ? 'bg-black border-yellow-400 text-yellow-300' 
        : 'bg-[#080C14]/85 border-cyan-500/20 text-white'
    }`}>
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-blue-950 via-cyan-950 to-indigo-950 px-4 py-1 border-b border-cyan-500/10 text-xs flex justify-between items-center text-cyan-200">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            SIH 2026 PROTOTYPE
          </span>
          <span className="hidden sm:inline opacity-80">🇮🇳 Digital India | SathiX Citizen Operating System</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-mono">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>IST {time || '10:00:00 AM'}</span>
          </div>
          <span className="hidden md:inline text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            Services Online (100%)
          </span>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('landing')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  SathiX
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Digital Citizen Assistant
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? highContrast
                        ? 'bg-yellow-400 text-black shadow-md font-bold'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 text-xs text-slate-200 transition"
              >
                <Languages className="w-4 h-4 text-cyan-400" />
                <span className="font-medium hidden sm:inline">{currentLangObj.nativeName}</span>
                <span className="font-medium sm:hidden">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0D1322] border border-cyan-500/30 rounded-xl shadow-2xl p-1 z-50 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800">
                    Select Citizen Language
                  </div>
                  {MOCK_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setActiveLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                        activeLanguage === lang.code
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-500">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              title="Toggle High Contrast Mode"
              className={`p-2 rounded-xl border transition-all ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500'
                  : 'bg-slate-900/80 border-slate-700/60 hover:border-yellow-400/50 text-yellow-400'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Direct Start Assistant CTA */}
            <button
              onClick={() => setActiveTab('assistant')}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Scrollable Switcher */}
      <div className="lg:hidden px-2 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center space-x-1 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
