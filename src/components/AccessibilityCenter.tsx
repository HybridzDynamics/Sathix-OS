import React from 'react';
import { MOCK_LANGUAGES } from '../data/mockData';
import { AccessibilitySettings } from '../types';
import { 
  SlidersHorizontal, 
  Languages, 
  Type, 
  Eye, 
  Volume2, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Sun,
  Layout
} from 'lucide-react';

interface AccessibilityCenterProps {
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
  highContrast: boolean;
  setHighContrast: (hc: boolean) => void;
}

export const AccessibilityCenter: React.FC<AccessibilityCenterProps> = ({
  settings,
  setSettings,
  activeLanguage,
  setActiveLanguage,
  highContrast,
  setHighContrast,
}) => {
  return (
    <div className="min-h-screen bg-[#070B14] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              GIGW 3.0 & WCAG 2.1 AAA COMPLIANT
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mt-2">Citizen Accessibility & Language Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize language, font scaling, voice speed, contrast, and layout for an inclusive digital India experience.
          </p>
        </div>

        {/* Section 1: Multilingual Language Grid */}
        <div className="bg-[#0B101E] border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Languages className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Select Official Indian Language (12 Supported)</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {MOCK_LANGUAGES.map((lang) => {
              const isSelected = activeLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setActiveLanguage(lang.code)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10 font-bold'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{lang.flag}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="text-sm font-bold mt-2">{lang.nativeName}</div>
                  <div className="text-[10px] text-slate-400">{lang.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Text Size & Font Scaling Controls */}
        <div className="bg-[#0B101E] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Type className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Text Size Scaling</h2>
          </div>

          <p className="text-xs text-slate-400">
            Increase readability by adjusting the root text size across the entire SathiX OS application interface.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'small', label: 'Small (14px)' },
              { id: 'normal', label: 'Default (16px)' },
              { id: 'large', label: 'Large (18px)' },
              { id: 'xlarge', label: 'Extra Large (20px)' },
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => setSettings(prev => ({ ...prev, fontSize: size.id as any }))}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition border ${
                  settings.fontSize === size.id
                    ? 'bg-cyan-400 text-slate-950 border-cyan-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: High Contrast & Dyslexia Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* High Contrast Toggle */}
          <div className="bg-[#0B101E] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Eye className="w-5 h-5 text-yellow-400" />
              <h2 className="text-base font-bold text-white">High Contrast Visibility</h2>
            </div>
            <p className="text-xs text-slate-400">
              Switches to an ultra-high contrast dark/yellow theme designed for visually impaired citizens.
            </p>
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                setSettings(prev => ({ ...prev, highContrast: !highContrast }));
              }}
              className={`w-full py-3 rounded-xl font-bold text-xs transition border flex items-center justify-center space-x-2 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-500 shadow-lg'
                  : 'bg-slate-900 text-yellow-400 border-slate-800 hover:border-yellow-400/40'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{highContrast ? 'High Contrast Mode Enabled ✓' : 'Enable High Contrast Mode'}</span>
            </button>
          </div>

          {/* Dyslexic Font Mode Toggle */}
          <div className="bg-[#0B101E] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">Dyslexia-Friendly Font</h2>
            </div>
            <p className="text-xs text-slate-400">
              Enhance glyph separation and weight distribution to aid citizens with dyslexia.
            </p>
            <button
              onClick={() => setSettings(prev => ({ ...prev, dyslexicFont: !prev.dyslexicFont }))}
              className={`w-full py-3 rounded-xl font-bold text-xs transition border flex items-center justify-center space-x-2 ${
                settings.dyslexicFont
                  ? 'bg-purple-500 text-white border-purple-400 shadow-lg'
                  : 'bg-slate-900 text-purple-300 border-slate-800 hover:border-purple-400/40'
              }`}
            >
              <span>{settings.dyslexicFont ? 'Dyslexic Font Active ✓' : 'Enable Dyslexic Font Mode'}</span>
            </button>
          </div>

        </div>

        {/* Section 4: Voice Speed Controls */}
        <div className="bg-[#0B101E] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Voice Assistant Speech Speed</h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">{settings.voiceSpeed}x Speed</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setSettings(prev => ({ ...prev, voiceSpeed: speed }))}
                className={`py-3 rounded-xl text-xs font-bold transition border ${
                  settings.voiceSpeed === speed
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {speed}x {speed === 1.0 ? '(Normal)' : ''}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
