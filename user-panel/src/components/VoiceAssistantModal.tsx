import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Volume2, Sparkles, ArrowRight } from 'lucide-react';
import { Language, Scheme } from '../types';
import { translations } from '../utils/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectScheme: (schemeId: string) => void;
  onSearchQuery: (query: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectScheme,
  onSearchQuery,
}) => {
  const [isListening, setIsListening] = useState(true);
  const [spokenText, setSpokenText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const t = translations[language] || translations.en;

  const sampleQueries = language === 'hi' ? [
    'किसान सम्मान निधि के ₹2,000 कब आएंगे?',
    'मुफ्त इलाज वाला आयुष्मान कार्ड कैसे बनेगा?',
    'पक्के मकान के लिए ग्रामीण आवास योजना',
    'फ्री गैस सिलेंडर उज्ज्वला योजना',
  ] : [
    'How do I apply for PM-Kisan income support?',
    'Ayushman Bharat ₹5 Lakh health card eligibility',
    'Financial aid for rural pucca house (PMAY)',
    'Free LPG connection under Ujjwala scheme',
  ];

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setSpokenText('');
      setAiResponse('');
      
      // Simulated listening cycle
      const timer = setTimeout(() => {
        if (language === 'hi') {
          setSpokenText('किसान के लिए कौन सी योजना उपलब्ध है?');
          setAiResponse('नमस्ते रवि जी! आपकी 2.4 एकड़ जमीन के अनुसार आप "पीएम-किसान योजना" (₹6,000/वर्ष) और "किसान क्रेडिट कार्ड" (4% ब्याज लोन) के लिए 95% पात्र हैं।');
        } else {
          setSpokenText('Which schemes are available for a small farmer in UP?');
          setAiResponse('Hello Ravi! Based on your 2.4-acre landholding in Uttar Pradesh, you have a 95% match for PM-Kisan Scheme (₹6,000/yr direct benefit) and Kisan Credit Card.');
        }
        setIsListening(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleQueryClick = (q: string) => {
    setSpokenText(q);
    setIsListening(false);
    if (q.toLowerCase().includes('kisan') || q.includes('किसान')) {
      setAiResponse(language === 'hi' ? 'पीएम-किसान योजना के लिए आपका आधार और जमीन का रिकॉर्ड पहले से सत्यापित है। तुरंत आवेदन करें!' : 'Your PM-Kisan Aadhaar and land record matches have been verified. Click Apply below!');
    } else if (q.toLowerCase().includes('ayushman') || q.includes('आयुष्मान') || q.toLowerCase().includes('health')) {
      setAiResponse(language === 'hi' ? 'आयुष्मान भारत के तहत आपको ₹5 लाख तक का सालाना कैशलेस इलाज मिलेगा।' : 'Ayushman Bharat provides ₹5 Lakh/yr family hospital treatment cover.');
    } else {
      setAiResponse(language === 'hi' ? 'योजना का विवरण लोड किया जा रहा है...' : 'Matching government schemes based on your citizen profile...');
    }
  };

  return (
    <div 
      id="voice-assistant-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div 
        id="voice-assistant-modal-card"
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="close-voice-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* AI Voice Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F2FD] text-[#1565C0] text-xs font-semibold mb-4 border border-[#BBDEFB]">
          <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
          <span>SarthixOS AI Voice Assistant</span>
        </div>

        {/* Animated Mic Wave */}
        <div className="relative my-4 flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-[#BBDEFB] animate-ping opacity-60"></div>
              <div className="absolute w-20 h-20 rounded-full bg-[#E3F2FD] animate-pulse"></div>
            </>
          )}
          
          <button
            id="toggle-mic-btn"
            onClick={() => setIsListening(!isListening)}
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isListening ? 'bg-[#2196F3] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isListening ? <Mic className="w-7 h-7 animate-pulse" /> : <MicOff className="w-7 h-7" />}
          </button>
        </div>

        {/* Status Text */}
        <h3 className="text-base sm:text-lg font-bold text-[#1A237E] mt-2">
          {isListening ? t.voiceListening : spokenText ? 'Query Recognized' : 'Tap mic to speak'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
          {t.voicePrompt}
        </p>

        {/* Live Spoken Recognition / AI Response Box */}
        {(spokenText || aiResponse) && (
          <div className="w-full mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-left space-y-3">
            {spokenText && (
              <div className="flex items-start gap-2.5">
                <span className="text-xs font-bold text-slate-400 uppercase shrink-0 pt-0.5">You:</span>
                <p className="text-sm font-semibold text-[#1A237E]">"{spokenText}"</p>
              </div>
            )}

            {aiResponse && (
              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/60">
                <Volume2 className="w-4 h-4 text-[#2196F3] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">{aiResponse}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      id="voice-result-apply-btn"
                      onClick={() => {
                        onSelectScheme('pm-kisan');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-[#2196F3] hover:bg-[#1E88E5] text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span>Open PM-Kisan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      id="voice-result-explore-btn"
                      onClick={() => {
                        onSearchQuery('kisan');
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-[#E3F2FD] hover:text-[#1A237E] text-xs font-semibold rounded-lg transition-colors"
                    >
                      Show All Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Sample Query Buttons */}
        <div className="w-full mt-5 pt-3 border-t border-slate-100 text-left">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            Try saying or tapping:
          </div>
          <div className="flex flex-col gap-1.5">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                id={`sample-query-${idx}`}
                onClick={() => handleQueryClick(q)}
                className="text-left text-xs bg-slate-50 hover:bg-[#E3F2FD] hover:text-[#1A237E] text-slate-700 px-3 py-2 rounded-xl transition-colors border border-slate-100 flex items-center justify-between group"
              >
                <span className="truncate">{q}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2196F3] shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
