import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ActiveTab } from '../types';
import { MOCK_CHAT_INITIAL, MOCK_AI_RESPONSES, MOCK_LANGUAGES } from '../data/mockData';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  User, 
  ArrowUpRight, 
  Volume2, 
  RefreshCw,
  Sparkles,
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 flex flex-col justify-between">
      
      {/* Header bar for Chat Interface */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">SathiX AI Voice & Text Copilot</h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-700 border border-blue-200">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Conversational Assistance in {MOCK_LANGUAGES.find(l => l.code === activeLanguage)?.nativeName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Clear Chat */}
          <button 
            onClick={() => setMessages(MOCK_CHAT_INITIAL)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center space-x-1"
            title="Reset Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Reset</span>
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
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Bubble Container */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[11px] opacity-70 border-b border-current/10 pb-1.5 font-medium">
                <span>{msg.sender === 'user' ? 'Ramesh Verma' : 'SathiX AI Companion'}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content Text */}
              <div className="whitespace-pre-line text-sm sm:text-base font-medium">
                {msg.text}
              </div>

              {/* Embedded Schemes Cards (if AI suggested any) */}
              {msg.suggestedSchemes && msg.suggestedSchemes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Recommended Matching Schemes:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {msg.suggestedSchemes.map((sch) => (
                      <div
                        key={sch.id}
                        className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{sch.title}</div>
                          <div className="text-[11px] text-blue-700 font-mono font-medium mt-0.5">
                            Benefit: {sch.benefitAmount}
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('schemes')}
                          className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold border border-blue-200 flex items-center space-x-1 whitespace-nowrap self-end sm:self-auto"
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
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-xs text-slate-700 font-medium transition flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-blue-500" />
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
            <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center text-xs">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">SathiX is computing eligibility...</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        {/* Document Scanner Loading Overlay State */}
        {isScanningDoc && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-2 animate-pulse">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-blue-700 font-semibold">Scanning uploaded document with AI OCR & Land Records DB...</p>
          </div>
        )}

        {/* Voice Listening Active Waveform Simulation */}
        {isListening && (
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-3">
            <div className="flex justify-center items-center space-x-1.5">
              <span className="w-1.5 h-6 bg-purple-400 animate-pulse"></span>
              <span className="w-1.5 h-10 bg-blue-400 animate-pulse [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-14 bg-pink-400 animate-pulse [animation-delay:0.3s]"></span>
              <span className="w-1.5 h-8 bg-purple-400 animate-pulse [animation-delay:0.45s]"></span>
              <span className="w-1.5 h-12 bg-blue-400 animate-pulse [animation-delay:0.6s]"></span>
            </div>
            <p className="text-xs font-bold text-purple-700">Listening to your voice... Speak your query in Hindi or English</p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompt Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Suggested Prompts:
          </span>
          <button
            onClick={() => handleSend("Which schemes am I eligible for?")}
            className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium whitespace-nowrap transition"
          >
            💡 "Which schemes am I eligible for?"
          </button>
          <button
            onClick={() => handleSend("How can I apply for scholarships?")}
            className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium whitespace-nowrap transition"
          >
            🎓 "How can I apply for scholarships?"
          </button>
          <button
            onClick={() => handleSend("What documents are required for housing scheme?")}
            className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium whitespace-nowrap transition"
          >
            📑 "What documents are required?"
          </button>
        </div>
      </div>

      {/* Input controls box */}
      <div className="bg-slate-50 border-t border-slate-200 p-4 max-w-4xl mx-auto w-full">
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
            className="p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 transition shadow-sm"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            title="Voice Assistant Mic"
            className={`p-3 rounded-xl border transition shadow-sm ${
              isListening
                ? 'bg-purple-600 text-white border-purple-600 animate-pulse'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about schemes, loans, scholarships, or documents..."
            className="flex-1 bg-white border border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span>AI Response simulated based on standard rules.</span>
          <span className="text-slate-400 font-mono">Accessible</span>
        </div>
      </div>

    </div>
  );
};
