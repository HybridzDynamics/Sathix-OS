import React from 'react';
import { MOCK_LANGUAGES } from '../data/mockData';
import { AccessibilitySettings } from '../types';
import { 
  Languages, 
  Type, 
  Eye, 
  Volume2, 
  Check, 
  BookOpen, 
  Sun,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
              GIGW 3.0 & WCAG 2.1 AAA COMPLIANT
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Citizen Accessibility & Language Center</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Customize language, font scaling, voice speed, contrast, and layout for an inclusive digital India experience.
          </p>
        </div>

        {/* Section 1: Multilingual Language Grid */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Languages className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Select Official Indian Language (12 Supported)</h2>
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
                      ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{lang.flag}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="text-sm font-bold mt-2">{lang.nativeName}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{lang.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Text Size & Font Scaling Controls */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Type className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Text Size Scaling</h2>
          </div>

          <p className="text-xs text-slate-600 font-medium">
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
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Eye className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">High Contrast Visibility</h2>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Switches to an ultra-high contrast dark/yellow theme designed for visually impaired citizens.
            </p>
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                setSettings(prev => ({ ...prev, highContrast: !highContrast }));
              }}
              className={`w-full py-3 rounded-xl font-bold text-xs transition border flex items-center justify-center space-x-2 ${
                highContrast
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{highContrast ? 'High Contrast Mode Enabled ✓' : 'Enable High Contrast Mode'}</span>
            </button>
          </div>

          {/* Dyslexic Font Mode Toggle */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">Dyslexia-Friendly Font</h2>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Enhance glyph separation and weight distribution to aid citizens with dyslexia.
            </p>
            <button
              onClick={() => setSettings(prev => ({ ...prev, dyslexicFont: !prev.dyslexicFont }))}
              className={`w-full py-3 rounded-xl font-bold text-xs transition border flex items-center justify-center space-x-2 ${
                settings.dyslexicFont
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-purple-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{settings.dyslexicFont ? 'Dyslexic Font Active ✓' : 'Enable Dyslexic Font Mode'}</span>
            </button>
          </div>

        </div>

        {/* Section 4: Voice Speed Controls */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Voice Assistant Speech Speed</h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">{settings.voiceSpeed}x Speed</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setSettings(prev => ({ ...prev, voiceSpeed: speed }))}
                className={`py-3 rounded-xl text-xs font-bold transition border ${
                  settings.voiceSpeed === speed
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
