import React from 'react';
import { 
  ArrowLeft, 
  Eye, 
  MousePointerClick, 
  Languages, 
  ChevronRight, 
  Check, 
  Sparkles,
  Volume2,
  Sliders,
  Type
} from 'lucide-react';
import { Language, AccessibilitySettings, TextSize } from '../../types';
import { translations } from '../../utils/translations';

interface AccessibilityViewProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  language: Language;
  onOpenLanguagePicker: () => void;
  onBack: () => void;
}

export const AccessibilityView: React.FC<AccessibilityViewProps> = ({
  settings,
  onUpdateSettings,
  language,
  onOpenLanguagePicker,
  onBack,
}) => {
  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  const textSizes: TextSize[] = ['S', 'M', 'L', 'XL'];

  // Calculate font size styling for the live preview
  const getPreviewFontSize = (size: TextSize) => {
    switch (size) {
      case 'S':
        return 'text-sm';
      case 'M':
        return 'text-base';
      case 'L':
        return 'text-lg';
      case 'XL':
        return 'text-xl font-medium';
      default:
        return 'text-base';
    }
  };

  const getLanguageDisplayName = (code: Language) => {
    switch (code) {
      case 'en':
        return 'English (US)';
      case 'hi':
        return 'Hindi (हिंदी)';
      case 'ta':
        return 'Tamil (தமிழ்)';
      case 'te':
        return 'Telugu (తెలుగు)';
      case 'bn':
        return 'Bengali (বাংলা)';
      case 'mr':
        return 'Marathi (मराठी)';
      default:
        return 'English (US)';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 pb-20 pt-2 px-3 sm:px-0 animate-in fade-in duration-200">
      {/* Top Bar with Back button */}
      <div className="flex items-center gap-3">
        <button
          id="accessibility-back-btn"
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-slate-700 hover:bg-slate-200/70 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
          title="Back to Profile"
          aria-label="Back to Profile"
        >
          <ArrowLeft className="w-6 h-6 text-[#1A237E]" />
        </button>
        <span className="text-base font-bold text-[#1A237E]">
          {isHindi ? 'सुगमता' : 'Accessibility'}
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A237E] tracking-tight">
          {isHindi ? 'सुगमता विकल्प' : 'Accessibility Options'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isHindi 
            ? 'सारथीओएस को अपनी सुविधा अनुसार अनुकूलित करें।' 
            : 'Customize SarthixOS to work best for you.'}
        </p>
      </div>

      {/* ================= 1. DISPLAY SECTION ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_16px_rgba(26,35,126,0.04)] space-y-6">
        <div className="flex items-center gap-2.5 text-[#1A237E] font-bold text-base pb-1 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <span>{isHindi ? 'डिस्प्ले और टेक्स्ट' : 'Display'}</span>
        </div>

        {/* Text Size Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-slate-800">
              {isHindi ? 'टेक्स्ट का आकार' : 'Text Size'}
            </label>
            <span className="text-xs font-semibold text-[#2196F3] px-2 py-0.5 rounded-md bg-[#E3F2FD]">
              {settings.textSize === 'S' && (isHindi ? 'छोटा (Small)' : 'Small')}
              {settings.textSize === 'M' && (isHindi ? 'मध्यम (Medium / Default)' : 'Medium (Default)')}
              {settings.textSize === 'L' && (isHindi ? 'बड़ा (Large)' : 'Large')}
              {settings.textSize === 'XL' && (isHindi ? 'अति विशाल (Extra Large)' : 'Extra Large')}
            </span>
          </div>

          {/* Live Dynamic Preview Container */}
          <div 
            id="text-size-live-preview"
            className="p-4 sm:p-5 rounded-2xl bg-[#E3F2FD]/50 border border-[#BBDEFB] text-slate-800 transition-all min-h-[72px] flex items-center shadow-2xs"
          >
            <p className={`${getPreviewFontSize(settings.textSize)} leading-relaxed text-slate-900 transition-all`}>
              {isHindi 
                ? 'यह पाठ आपके चुने गए आकार का पूर्वावलोकन दिखाता है।' 
                : 'The quick brown fox jumps over the lazy dog.'}
            </p>
          </div>

          {/* S / M / L / XL Segmented Pill Controller */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            {textSizes.map((size) => {
              const isSelected = settings.textSize === size;
              return (
                <button
                  key={size}
                  id={`text-size-btn-${size}`}
                  type="button"
                  onClick={() => onUpdateSettings({ textSize: size })}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none ${
                    isSelected
                      ? 'bg-white text-[#1A237E] shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                  aria-pressed={isSelected}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* High-Contrast Mode Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <div className="pr-4">
            <div className="text-sm font-bold text-slate-800">
              {isHindi ? 'उच्च कंट्रास्ट मोड' : 'High-Contrast Mode'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {isHindi ? 'आसानी से पढ़ने के लिए गहरा कंट्रास्ट' : 'Increases contrast for easier reading'}
            </div>
          </div>
          <button
            id="toggle-high-contrast"
            type="button"
            role="switch"
            aria-checked={settings.highContrast}
            onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 ${
              settings.highContrast ? 'bg-[#2196F3]' : 'bg-slate-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.highContrast ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <div className="pr-4">
            <div className="text-sm font-bold text-slate-800">
              {isHindi ? 'कम एनिमेशन (Reduced Motion)' : 'Reduced Motion'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {isHindi ? 'एनिमेशन और स्क्रीन ट्रांज़िशन को कम करता है' : 'Reduces animations and transitions'}
            </div>
          </div>
          <button
            id="toggle-reduced-motion"
            type="button"
            role="switch"
            aria-checked={settings.reducedMotion}
            onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 ${
              settings.reducedMotion ? 'bg-[#2196F3]' : 'bg-slate-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* ================= 2. INTERACTION SECTION ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_16px_rgba(26,35,126,0.04)] space-y-4">
        <div className="flex items-center gap-2.5 text-[#1A237E] font-bold text-base pb-1 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center">
            <MousePointerClick className="w-4 h-4" />
          </div>
          <span>{isHindi ? 'इंटरैक्शन व नियंत्रण' : 'Interaction'}</span>
        </div>

        {/* Screen-Reader Friendly UI Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="pr-4">
            <div className="text-sm font-bold text-slate-800">
              {isHindi ? 'स्क्रीन-रीडर अनुकूल यूआई' : 'Screen-Reader Friendly UI'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {isHindi ? 'स्क्रीन रीडर के लिए लेआउट अनुकूलित करता है' : 'Optimizes layout for screen readers'}
            </div>
          </div>
          <button
            id="toggle-screen-reader"
            type="button"
            role="switch"
            aria-checked={settings.screenReaderFriendly}
            onClick={() => onUpdateSettings({ screenReaderFriendly: !settings.screenReaderFriendly })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 ${
              settings.screenReaderFriendly ? 'bg-[#2196F3]' : 'bg-slate-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.screenReaderFriendly ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Voice Interaction Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <div className="pr-4">
            <div className="text-sm font-bold text-slate-800">
              {isHindi ? 'वॉयस इंटरैक्शन (Voice Interaction)' : 'Voice Interaction'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {isHindi 
                ? 'ऐप में वॉयस कमांड व माइक सर्च को सक्षम करें' 
                : 'Enable voice commands and voice search throughout the app'}
            </div>
          </div>
          <button
            id="toggle-voice-interaction"
            type="button"
            role="switch"
            aria-checked={settings.voiceInteraction}
            onClick={() => onUpdateSettings({ voiceInteraction: !settings.voiceInteraction })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 ${
              settings.voiceInteraction ? 'bg-[#2196F3]' : 'bg-slate-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.voiceInteraction ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* ================= 3. LANGUAGE SECTION ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_16px_rgba(26,35,126,0.04)] space-y-4">
        <div className="flex items-center gap-2.5 text-[#1A237E] font-bold text-base pb-1 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center">
            <Languages className="w-4 h-4" />
          </div>
          <span>{isHindi ? 'भाषा प्राथमिकताएं' : 'Language'}</span>
        </div>

        {/* Simplified Language Mode Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="pr-4">
            <div className="text-sm font-bold text-slate-800">
              {isHindi ? 'सरल भाषा मोड' : 'Simplified Language Mode'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {isHindi ? 'सरल शब्दों और छोटे वाक्यों का उपयोग करता है' : 'Uses simpler words and shorter sentences'}
            </div>
          </div>
          <button
            id="toggle-simplified-language"
            type="button"
            role="switch"
            aria-checked={settings.simplifiedLanguage}
            onClick={() => onUpdateSettings({ simplifiedLanguage: !settings.simplifiedLanguage })}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 ${
              settings.simplifiedLanguage ? 'bg-[#2196F3]' : 'bg-slate-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.simplifiedLanguage ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Primary Language Row */}
        <div 
          id="accessibility-primary-language-row"
          onClick={onOpenLanguagePicker}
          className="flex items-center justify-between py-3 border-t border-slate-100 cursor-pointer hover:bg-slate-50/70 -mx-2 px-2 rounded-2xl transition-colors"
        >
          <div>
            <div className="text-sm font-bold text-slate-800">
              {isHindi ? 'प्राथमिक भाषा' : 'Primary Language'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {getLanguageDisplayName(language)}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};
