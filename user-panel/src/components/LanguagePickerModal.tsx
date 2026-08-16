import React from 'react';
import { X, Check, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface LanguagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const languages: { code: Language; name: string; native: string; subtitle: string }[] = [
    { code: 'en', name: 'English (US)', native: 'English', subtitle: 'Default Language' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', subtitle: 'राष्ट्रीय भाषा (Devanagari)' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', subtitle: 'தமிழ்நாடு' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', subtitle: 'ఆంధ్రప్రదేశ్ / తెలంగాణ' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', subtitle: 'পশ্চিমবঙ্গ' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', subtitle: 'महाराष्ट्र' },
  ];

  return (
    <div 
      id="language-picker-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
    >
      <div 
        id="language-picker-card"
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A237E]">
                Select Language / भाषा चुनें
              </h3>
              <p className="text-xs text-slate-500">
                Choose your preferred interface language
              </p>
            </div>
          </div>
          <button
            id="close-language-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Options List */}
        <div className="p-3 sm:p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`lang-option-${lang.code}`}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left ${
                  isSelected
                    ? 'bg-[#E3F2FD] border border-[#90CAF9] shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-[#2196F3] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {lang.native.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1A237E]">
                      {lang.native}
                    </div>
                    <div className="text-xs text-slate-500">
                      {lang.name} • <span className="opacity-80">{lang.subtitle}</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#2196F3] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50/90 border-t border-slate-100 text-center text-xs text-slate-500">
          Instant sync across all schemes, voice assistant, and forms
        </div>
      </div>
    </div>
  );
};
