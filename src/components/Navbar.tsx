import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { MOCK_LANGUAGES } from '../data/mockData';
import { 
  Bot, 
  Search, 
  User, 
  Home, 
  Sparkles, 
  Eye, 
  Clock, 
  Languages, 
  ChevronDown,
  Menu,
  X
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
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.FC<any> }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'info', label: 'How it Works', icon: Sparkles },
    { id: 'assistant', label: 'Ask AI Assistant', icon: Bot },
    { id: 'schemes', label: 'Search Schemes', icon: Search },
    { id: 'status', label: 'Track Application', icon: Clock },
    { id: 'dashboard', label: 'My Portal', icon: User },
  ];

  const currentLangObj = MOCK_LANGUAGES.find(l => l.code === activeLanguage) || MOCK_LANGUAGES[0];

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
      highContrast 
        ? 'bg-white border-black text-black border-b-4' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => {
              setActiveTab('landing');
              setIsMenuOpen(false);
            }} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  SathiX
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Citizen Assistant
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 transition"
              >
                <Languages className="w-4 h-4 text-blue-600" />
                <span className="font-medium hidden sm:inline">{currentLangObj.nativeName}</span>
                <span className="font-medium sm:hidden">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Language
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
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
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
                  ? 'bg-black text-white border-black'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dropdown Menu (Mobile & Desktop) */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-full sm:w-80 bg-white border-b sm:border-l sm:border-b border-slate-200 shadow-xl sm:rounded-bl-2xl overflow-hidden">
          <div className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => {
                setActiveTab('assistant');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-sm transition"
            >
              <Bot className="w-5 h-5" />
              <span>Talk to Assistant Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
