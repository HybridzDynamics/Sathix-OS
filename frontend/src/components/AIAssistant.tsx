import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Scheme, ActiveTab } from '../types';
import { MOCK_CHAT_INITIAL, MOCK_AI_RESPONSES, MOCK_LANGUAGES } from '../data/mockData';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Languages, 
  Sparkles, 
  User, 
  FileText, 
  CheckCircle, 
  ArrowUpRight, 
  Volume2, 
  RefreshCw,
  Info,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface AIAssistantProps {
  setActiveTab: (tab: ActiveTab) => void;
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  setActiveTab,
  activeLanguage,
  setActiveLanguage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_INITIAL);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle User Input Submission
  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Simulate AI Response lookup
    setTimeout(() => {
      let responseKey = 'default';
      const qLower = query.toLowerCase();

      if (qLower.includes('eligible') || qLower.includes('qualify') || qLower.includes('scheme for me')) {
        responseKey = 'eligible';
      } else if (qLower.includes('scholarship') || qLower.includes('education') || qLower.includes('student')) {
        responseKey = 'scholarship';
      } else if (qLower.includes('document') || qLower.includes('paper') || qLower.includes('proof')) {
        responseKey = 'documents';
      } else if (qLower.includes('kisan') || qLower.includes('farmer') || qLower.includes('6000')) {
        responseKey = 'pmkisan';
      }

      const match = MOCK_AI_RESPONSES[responseKey];
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: match.text,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        suggestedSchemes: match.schemes,
        actionPrompts: match.actionPrompts
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Simulate Voice Assistant Toggle
  const toggleVoiceRecording = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleSend("Which schemes am I eligible for based on my farmer profile?");
      }, 3500);
    }
  };

  // Simulate Document Scanning
  const handleDocumentUploadMock = () => {
    setIsScanningDoc(true);
    setTimeout(() => {
      setIsScanningDoc(false);
      const docMsg: ChatMessage = {
        id: `msg-doc-${Date.now()}`,
        sender: 'ai',
        text: '📄 **Aadhaar & Land Khatauni Document Analysis Complete!**\n\n- Document Confidence: **99.8% Verified**\n- Landholding Detected: **1.2 Hectares (Varanasi UP)**\n- Income Level: **Under ₹2.0 Lakh/yr**\n\n🎉 Based on this uploaded document, you qualify for **PM-KISAN (₹6,000/yr)** and **Ayushman Bharat Health Cover (₹5 Lakh)**.',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        documentAnalysisResult: {
          documentName: 'Aadhaar_Khatauni_Verified.pdf',
          confidence: '99.8%',
          matchedSchemesCount: 2
        },
        actionPrompts: ['Check PM-Kisan status now', 'Upload next document', 'View Saved Vault']
      };
      setMessages((prev) => [...prev, docMsg]);
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070B14] text-white flex flex-col justify-between">
      
      {/* Header bar for Chat Interface */}
      <div className="bg-[#0B101E] border-b border-cyan-500/20 px-4 py-3 sm:px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B101E]"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-bold text-white">SathiX AI Voice & Text Copilot</h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Conversational Assistance in {MOCK_LANGUAGES.find(l => l.code === activeLanguage)?.nativeName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Clear Chat */}
          <button 
            onClick={() => setMessages(MOCK_CHAT_INITIAL)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs flex items-center space-x-1"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble Container */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-none shadow-lg'
                  : 'bg-[#0E1527] border border-cyan-500/20 text-slate-200 rounded-tl-none shadow-xl backdrop-blur-md'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[11px] opacity-70 border-b border-white/10 pb-1.5">
                <span className="font-semibold">{msg.sender === 'user' ? 'Ramesh Verma' : 'SathiX AI Companion'}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content Text */}
              <div className="whitespace-pre-line text-sm sm:text-base">
                {msg.text}
              </div>

              {/* Embedded Schemes Cards (if AI suggested any) */}
              {msg.suggestedSchemes && msg.suggestedSchemes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Recommended Matching Schemes:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {msg.suggestedSchemes.map((sch) => (
                      <div
                        key={sch.id}
                        className="bg-[#080D1A] p-3.5 rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{sch.title}</div>
                          <div className="text-[11px] text-cyan-400 font-mono font-medium mt-0.5">
                            Benefit: {sch.benefitAmount}
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('schemes')}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center space-x-1 whitespace-nowrap self-end sm:self-auto"
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Prompt Chips */}
              {msg.actionPrompts && msg.actionPrompts.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {msg.actionPrompts.map((promptText, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(promptText)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-xs text-cyan-300 hover:text-white transition flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>{promptText}</span>
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}

        {/* AI Typing Animation Shimmer */}
        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xs">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-[#0E1527] border border-cyan-500/20 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
              <span className="text-xs text-cyan-400 font-medium">SathiX is computing eligibility...</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Document Scanner Loading Overlay State */}
        {isScanningDoc && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-2 animate-pulse">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-cyan-300 font-semibold">Scanning uploaded document with AI OCR & Land Records DB...</p>
          </div>
        )}

        {/* Voice Listening Active Waveform Simulation */}
        {isListening && (
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center space-y-3">
            <div className="flex justify-center items-center space-x-1.5">
              <span className="w-1.5 h-6 bg-purple-400 animate-pulse"></span>
              <span className="w-1.5 h-10 bg-cyan-400 animate-pulse [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-14 bg-pink-400 animate-pulse [animation-delay:0.3s]"></span>
              <span className="w-1.5 h-8 bg-purple-400 animate-pulse [animation-delay:0.45s]"></span>
              <span className="w-1.5 h-12 bg-cyan-400 animate-pulse [animation-delay:0.6s]"></span>
            </div>
            <p className="text-xs font-bold text-purple-300">Listening to your voice... Speak your query in Hindi or English</p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompt Bar */}
      <div className="bg-[#0A0E1A] border-t border-slate-800/80 px-4 py-2.5 max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Suggested Prompts:
          </span>
          <button
            onClick={() => handleSend("Which schemes am I eligible for?")}
            className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition"
          >
            💡 "Which schemes am I eligible for?"
          </button>
          <button
            onClick={() => handleSend("How can I apply for scholarships?")}
            className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition"
          >
            🎓 "How can I apply for scholarships?"
          </button>
          <button
            onClick={() => handleSend("What documents are required for housing scheme?")}
            className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition"
          >
            📑 "What documents are required?"
          </button>
        </div>
      </div>

      {/* Input controls box */}
      <div className="bg-[#0B101F] border-t border-cyan-500/20 p-4 max-w-4xl mx-auto w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          {/* Document Upload Button */}
          <button
            type="button"
            onClick={handleDocumentUploadMock}
            title="Upload Document for AI Scan"
            className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-400 transition shadow"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            title="Voice Assistant Mic"
            className={`p-3 rounded-xl border transition shadow ${
              isListening
                ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                : 'bg-slate-900 border-slate-700/80 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-400'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about schemes, loans, scholarships, or documents in your language..."
            className="flex-1 bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span>AI Response simulated based on standard Ministry rules dataset.</span>
          <span className="text-cyan-400 font-mono">WCAG Voice & Keyboard Accessible</span>
        </div>
      </div>

    </div>
  );
};
