import React, { useState, useRef, useEffect } from 'react';
import { 
  Scheme, 
  Language, 
  UserProfile, 
  ChatMessage, 
  ChatAttachment,
  ChatSession
} from '../../types';
import { allSchemes } from '../../data/schemes';
import { ChatHeader } from '../chat/ChatHeader';
import { ChatInlineSchemeCard } from '../chat/ChatInlineSchemeCard';
import { 
  Lightbulb, 
  Tractor, 
  ClipboardList, 
  Landmark, 
  Paperclip, 
  Mic, 
  MicOff, 
  SendHorizontal, 
  Bot, 
  Sparkles, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  X, 
  FileCheck,
  Building2,
  HelpCircle,
  UploadCloud
} from 'lucide-react';

interface HomeViewProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenProfile: () => void;
  audioNarrationActive: boolean;
  onToggleNarration: () => void;
  onViewSchemeDetails: (scheme: Scheme) => void;
  onNavigateToApplications: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeSession: ChatSession | null;
  onUpdateSessionMessages: (messages: ChatMessage[], firstQuery?: string) => void;
  onNewChat: () => void;
  voiceEnabled?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  language,
  onLanguageChange,
  onOpenProfile,
  audioNarrationActive,
  onToggleNarration,
  onViewSchemeDetails,
  onNavigateToApplications,
  isSidebarOpen,
  onToggleSidebar,
  activeSession,
  onUpdateSessionMessages,
  onNewChat,
  voiceEnabled = true,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(activeSession ? activeSession.messages : []);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<ChatAttachment | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isHindi = language === 'hi';

  // Sync messages when activeSession prop changes (e.g. user clicked a historic conversation in the left sidebar)
  useEffect(() => {
    if (activeSession) {
      setMessages(activeSession.messages);
    } else {
      setMessages([]);
    }
  }, [activeSession?.id]);

  // Format current timestamp (e.g., "Today, 10:42 AM")
  const getFormattedTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return isHindi ? `आज, ${timeStr}` : `Today, ${timeStr}`;
  };

  // Get dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = isHindi ? user.nameHindi : user.name.split(' ')[0];
    
    if (hour < 12) {
      return isHindi ? `सुप्रभात, ${name}` : `Good morning, ${name}`;
    } else if (hour < 17) {
      return isHindi ? `नमस्ते, ${name}` : `Good afternoon, ${name}`;
    } else {
      return isHindi ? `शुभ संध्या, ${name}` : `Good evening, ${name}`;
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (messages.length > 0 || isThinking) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Read response out loud if audioNarrationActive
  const speakText = (text: string) => {
    if (!audioNarrationActive) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // safe fallback
    }
  };

  // Dispatch a message into conversation and save to active session history
  const sendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query && !attachedFile) return;

    const userMessageText = query || (attachedFile ? `Uploaded document: ${attachedFile.name}` : '');
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: getFormattedTime(),
      text: userMessageText,
      attachment: attachedFile ? { ...attachedFile } : undefined,
    };

    const newMessagesList = [...messages, userMsg];
    setMessages(newMessagesList);
    setInputText('');
    setAttachedFile(null);
    setShowAttachMenu(false);
    setIsListening(false);
    setIsThinking(true);

    // Save user message immediately to session history
    onUpdateSessionMessages(newMessagesList, userMessageText);

    // Generate Contextual AI Response after simulated thinking delay
    setTimeout(() => {
      const lower = userMessageText.toLowerCase();
      let aiText = '';
      let recommendedIds: string[] | undefined = undefined;
      let documentsList: ChatMessage['documentsList'] = undefined;
      let applicationStatusData: ChatMessage['applicationStatusData'] = undefined;

      if (lower.includes('farmer') || lower.includes('bihar') || lower.includes('kisan') || lower.includes('agriculture') || lower.includes('crop')) {
        aiText = isHindi
          ? 'आपके द्वारा साझा की गई जानकारी के आधार पर, यहाँ 3 प्रमुख कृषि योजनाएं हैं जिनके लिए आप पात्र हैं:'
          : "Based on what you've shared, here are 3 schemes you may be eligible for:";
        recommendedIds = ['pm-kisan', 'pm-fasal-bima', 'kisan-credit-card'];
      } else if (lower.includes('document') || lower.includes('documents') || lower.includes('paper') || lower.includes('aadhaar')) {
        aiText = isHindi
          ? 'पीएम किसान (PM-Kisan) के लिए आपको आमतौर पर निम्नलिखित दस्तावेजों की आवश्यकता होगी:'
          : 'For PM Kisan, you will typically need:';
        documentsList = [
          { icon: 'id-card', name: isHindi ? 'आधार कार्ड' : 'Aadhaar Card', description: 'Linked with active mobile number for OTP eKYC' },
          { icon: 'file-text', name: isHindi ? 'भूमि स्वामित्व दस्तावेज (खतौनी)' : 'Land Ownership Documents', description: 'Updated RoR/Khasra/Khatauni in your name' },
          { icon: 'building', name: isHindi ? 'बैंक पासबुक' : 'Bank Passbook', description: 'Aadhaar DBT linked bank account' },
        ];
      } else if (lower.includes('status') || lower.includes('application') || lower.includes('track') || lower.includes('check my application')) {
        aiText = isHindi
          ? 'यहाँ आपके चल रहे सरकारी आवेदनों की ताज़ा स्थिति है:'
          : 'Here is the real-time status of your ongoing government applications:';
        applicationStatusData = [
          { schemeTitle: 'PM-Kisan 17th Installment', refNo: 'PMK-2026-UP-88492', status: 'pending', stepText: 'Step 2/3: Land Record & Khatauni Cross-Verification in progress' },
          { schemeTitle: 'PM Surya Ghar: Rooftop Solar', refNo: 'PMSG-2026-90211', status: 'pending', stepText: 'Step 1/3: DISCOM Feasibility Inspection Scheduled' },
          { schemeTitle: 'Ayushman Bharat Golden Card', refNo: 'AB-JAY-4491028', status: 'approved', stepText: 'Step 3/3: Active & e-Card Ready for Cashless Treatment' },
        ];
      } else if (lower.includes('ayushman') || lower.includes('health') || lower.includes('hospital') || lower.includes('insurance')) {
        aiText = isHindi
          ? 'आयुष्मान भारत (PM-JAY) योजना के तहत प्रत्येक पात्र परिवार को प्रति वर्ष ₹5,00,000 तक का मुफ्त व कैशलेस स्वास्थ्य उपचार मिलता है। विवरण नीचे देखें:'
          : 'Ayushman Bharat (PM-JAY) provides free cashless secondary and tertiary hospitalization up to ₹5,00,000 per family per year. Here are the details:';
        recommendedIds = ['ayushman-bharat'];
      } else if (lower.includes('eligible') || lower.includes('what schemes') || lower.includes('qualify') || lower.includes('benefit')) {
        aiText = isHindi
          ? `नमस्ते ${user.nameHindi}, आपके ई-केवाईसी प्रोफाइल (लघु किसान, 2.4 एकड़ भूमि, वाराणसी, बीपीएल राशन कार्ड) के आधार पर, आप इन शीर्ष योजनाओं के लिए पात्र हैं:`
          : `Hello ${user.name.split(' ')[0]}, based on your verified eKYC profile (Small Farmer, 2.4 Acres Land in UP, BPL Ration Card), here are the top matching schemes for you:`;
        recommendedIds = ['pm-kisan', 'ayushman-bharat', 'pm-fasal-bima'];
      } else if (userMsg.attachment) {
        aiText = isHindi
          ? `दस्तावेज विश्लेषण पूर्ण (${userMsg.attachment.name}): 2.4 एकड़ कृषि भूमि और मान्य ई-केवाईसी रिकॉर्ड सत्यापित हुए। आप प्रत्यक्ष डीबीटी सब्सिडी के लिए पूर्ण रूप से पात्र हैं:`
          : `Document Analysis Complete for "${userMsg.attachment.name}": 2.4 Acres agricultural land record verified. You qualify for high-priority DBT subsidies:`;
        recommendedIds = ['pm-kisan', 'pm-fasal-bima'];
      } else {
        aiText = isHindi
          ? `मैंने आपका प्रश्न समझ लिया है: "${query}"। आपकी प्रोफाइल और पात्रता मानदंडों के अनुसार, यहाँ सबसे उपयुक्त सरकारी योजनाएं हैं:`
          : `Here is what I found for "${query}" based on your citizen profile and current state eligibility criteria:`;
        recommendedIds = ['pm-kisan', 'ayushman-bharat', 'pm-awas-gramin'];
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: getFormattedTime(),
        text: aiText,
        recommendedSchemeIds: recommendedIds,
        documentsList: documentsList,
        applicationStatusData: applicationStatusData,
      };

      const finalMessagesList = [...newMessagesList, aiMsg];
      setMessages(finalMessagesList);
      setIsThinking(false);
      onUpdateSessionMessages(finalMessagesList, userMessageText);
      speakText(aiText);
    }, 600);
  };

  // Handle suggestion chip click
  const handleSuggestionClick = (promptText: string) => {
    sendMessage(promptText);
  };

  // Handle local file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'application/pdf',
      });
      setShowAttachMenu(false);
    }
  };

  // Quick attach predefined mock Indian citizen documents
  const handleQuickAttach = (docName: string, size: string) => {
    setAttachedFile({
      name: docName,
      size: size,
      type: 'application/pdf',
    });
    setShowAttachMenu(false);
    if (!inputText) {
      setInputText(isHindi ? `कृपया इस दस्तावेज (${docName}) के आधार पर मेरी पात्रता जांचें` : `Check my eligibility based on this ${docName}`);
    }
  };

  // 4 Default Suggestion Cards
  const suggestionCards = [
    {
      id: 'chip-eligible',
      icon: Lightbulb,
      title: isHindi ? 'मैं किन योजनाओं के लिए पात्र हूँ?' : 'What schemes am I eligible for?',
      query: isHindi ? 'मैं किन योजनाओं के लिए पात्र हूँ?' : 'What schemes am I eligible for?',
    },
    {
      id: 'chip-farmers',
      icon: Tractor,
      title: isHindi ? 'मेरे पास किसान योजनाएं खोजें' : 'Find farmer schemes near me',
      query: isHindi ? 'I am a farmer in Bihar, what schemes can I get?' : "I'm a farmer in Bihar, what schemes can I get?",
    },
    {
      id: 'chip-status',
      icon: ClipboardList,
      title: isHindi ? 'मेरी आवेदन स्थिति जांचें' : 'Check my application status',
      query: isHindi ? 'मेरी आवेदन स्थिति जांचें' : 'Check my application status',
    },
    {
      id: 'chip-ayushman',
      icon: Landmark,
      title: isHindi ? 'आयुष्मान भारत योजना समझाइए' : 'Explain Ayushman Bharat',
      query: isHindi ? 'आयुष्मान भारत योजना के क्या लाभ हैं?' : 'Explain Ayushman Bharat',
    },
  ];

  const isConversationActive = messages.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-2rem)] relative text-slate-900">
      {/* Top App Header with Sidebar Toggle, Globe, SarthixOS Branding, + New Chat, and Profile Avatar */}
      <ChatHeader
        user={user}
        language={language}
        onLanguageChange={onLanguageChange}
        onOpenProfile={onOpenProfile}
        onNewChat={onNewChat}
        showNewChat={isConversationActive}
        audioNarrationActive={audioNarrationActive}
        onToggleNarration={onToggleNarration}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={onToggleSidebar}
      />

      {/* Main Body Area */}
      {!isConversationActive ? (
        /* ================= 1. EMPTY / WELCOME STATE ================= */
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-6 sm:py-10 max-w-xl mx-auto w-full animate-in fade-in duration-300">
          {/* Centered Greeting & Subtitle */}
          <div className="text-center sm:text-left mb-8 sm:mb-10">
            <h2 
              id="welcome-greeting-title"
              className="text-2xl sm:text-3xl font-extrabold text-[#1A237E] tracking-tight"
            >
              {getGreeting()}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              {isHindi
                ? 'किसी भी सरकारी योजना के बारे में पूछें, या अपनी पात्रता जानने के लिए अपनी स्थिति बताएं।'
                : "Ask me about any government scheme, or tell me about yourself to see what you're eligible for."}
            </p>
          </div>

          {/* 2x2 Grid Suggestion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-8">
            {suggestionCards.map((card) => {
              const IconComp = card.icon;
              return (
                <button
                  key={card.id}
                  id={card.id}
                  onClick={() => handleSuggestionClick(card.query)}
                  className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(26,35,126,0.04)] hover:shadow-[0_8px_24px_rgba(26,35,126,0.08)] hover:border-[#2196F3]/40 transition-all text-left flex flex-col justify-between h-36 sm:h-40 group focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug group-hover:text-[#1A237E]">
                    {card.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= 2. ACTIVE CONVERSATION STATE ================= */
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 pb-28">
          {/* Timestamp Header */}
          <div className="text-center">
            <span className="inline-block text-[11px] sm:text-xs font-medium text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full">
              {messages[0]?.timestamp || getFormattedTime()}
            </span>
          </div>

          {/* Message Thread */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            if (isUser) {
              return (
                <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="max-w-[85%] sm:max-w-[75%] bg-[#0B63E5] text-white rounded-3xl rounded-tr-xs px-4 sm:px-5 py-3 sm:py-3.5 shadow-sm text-sm font-normal leading-relaxed">
                    {/* Attachment preview if user uploaded file */}
                    {msg.attachment && (
                      <div className="mb-2 p-2 bg-white/10 rounded-xl border border-white/20 flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 shrink-0 text-white" />
                        <div className="truncate flex-1">
                          <span className="font-semibold block truncate">{msg.attachment.name}</span>
                          <span className="text-[10px] opacity-80">{msg.attachment.size}</span>
                        </div>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            }

            // AI Message
            return (
              <div key={msg.id} className="flex items-start gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Sarthix Robot Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#1A237E] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>

                {/* AI Content Container */}
                <div className="flex-1 space-y-3 min-w-0 max-w-[95%] sm:max-w-[92%]">
                  {/* Primary text bubble */}
                  <div className="bg-white rounded-3xl rounded-tl-xs p-4 sm:p-5 border border-slate-100 shadow-[0_2px_12px_rgba(26,35,126,0.04)] text-sm text-slate-800 leading-relaxed space-y-3">
                    <p>{msg.text}</p>

                    {/* Inline Document Checklist */}
                    {msg.documentsList && msg.documentsList.length > 0 && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        {msg.documentsList.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F8F9FA] border border-slate-100">
                            <div className="w-8 h-8 rounded-xl bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center shrink-0">
                              {doc.icon === 'id-card' && <CreditCard className="w-4 h-4" />}
                              {doc.icon === 'file-text' && <FileCheck className="w-4 h-4" />}
                              {doc.icon === 'building' && <Building2 className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                                {doc.name}
                              </span>
                              {doc.description && (
                                <span className="text-[11px] text-slate-500 block truncate">
                                  {doc.description}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Application Status Widgets */}
                    {msg.applicationStatusData && msg.applicationStatusData.length > 0 && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        {msg.applicationStatusData.map((app, idx) => (
                          <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#1A237E] truncate">{app.schemeTitle}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                app.status === 'approved' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">Ref: {app.refNo}</span>
                            <span className="text-xs text-slate-700 font-medium">{app.stepText}</span>
                          </div>
                        ))}
                        <button
                          onClick={onNavigateToApplications}
                          className="mt-2 text-xs font-bold text-[#2196F3] hover:underline flex items-center gap-1"
                        >
                          <span>Open Full Applications Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Inline Scheme Recommendations (1-col mobile, 2-col desktop) */}
                  {msg.recommendedSchemeIds && msg.recommendedSchemeIds.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {msg.recommendedSchemeIds.map((schemeId) => {
                        const schemeObj = allSchemes.find((s) => s.id === schemeId);
                        if (!schemeObj) return null;
                        return (
                          <ChatInlineSchemeCard
                            key={schemeObj.id}
                            scheme={schemeObj}
                            language={language}
                            onViewDetails={onViewSchemeDetails}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Typing Animation Indicator */}
          {isThinking && (
            <div className="flex items-start gap-2.5 animate-in fade-in duration-150">
              <div className="w-8 h-8 rounded-full bg-[#1A237E] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-3xl rounded-tl-xs px-4 py-3 border border-slate-100 shadow-xs flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#2196F3] animate-bounce"></span>
                </div>
                <span className="text-xs font-medium text-slate-500 ml-1">
                  {isHindi ? 'सारथी विचार कर रहा है...' : 'Sarthix is thinking...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* ================= 3. PERSISTENT BOTTOM INPUT BAR ================= */}
      <div className="sticky bottom-0 z-20 pb-4 pt-2 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/95 to-transparent px-2 sm:px-0">
        {/* Voice Listening Wave State Banner */}
        {isListening && (
          <div className="mb-2.5 p-3 rounded-2xl bg-[#E3F2FD] border border-[#BBDEFB] flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-6 h-6 rounded-full bg-[#2196F3] animate-ping opacity-60"></span>
                <span className="relative w-3 h-3 rounded-full bg-[#2196F3]"></span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#1A237E] block">
                  {isHindi ? '🎙️ आवाज सुनी जा रही है...' : '🎙️ Listening... Speak now in Hindi or English'}
                </span>
                <span className="text-[11px] text-slate-600 block">
                  {isHindi ? 'उदा: "किसान योजना" या "आवेदन स्थिति"' : 'Try: "What schemes for small farmer?"'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sendMessage("I'm a farmer with 2 acres land in UP, what schemes can I get?");
                  setIsListening(false);
                }}
                className="px-2.5 py-1 bg-white text-[#1A237E] text-[11px] font-bold rounded-lg border border-blue-200 hover:bg-blue-50 shadow-2xs"
              >
                Simulate Voice
              </button>
              <button
                onClick={() => setIsListening(false)}
                className="p-1 text-slate-500 hover:text-slate-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Attached file chip above input */}
        {attachedFile && (
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3F2FD] border border-[#BBDEFB] text-xs font-semibold text-[#1A237E] animate-in fade-in duration-150">
            <FileText className="w-3.5 h-3.5 text-[#2196F3]" />
            <span className="max-w-[200px] truncate">{attachedFile.name}</span>
            <span className="text-[10px] text-slate-500 font-normal">({attachedFile.size})</span>
            <button
              onClick={() => setAttachedFile(null)}
              className="p-0.5 hover:bg-blue-200 rounded-full text-slate-600 hover:text-slate-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Attachment preset popover */}
        {showAttachMenu && (
          <div className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-[0_8px_30px_rgba(26,35,126,0.15)] border border-slate-100 p-3 z-50 w-64 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-[#1A237E]">Attach Citizen Document</span>
              <button onClick={() => setShowAttachMenu(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Native file upload */}
            <button
              onClick={() => {
                fileInputRef.current?.click();
                setShowAttachMenu(false);
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 text-xs font-medium text-slate-700"
            >
              <UploadCloud className="w-4 h-4 text-[#2196F3]" />
              <span>Upload from device...</span>
            </button>

            {/* Quick simulated Indian docs */}
            <div className="mt-1 pt-1 border-t border-slate-100 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2">Quick Presets</span>
              <button
                onClick={() => handleQuickAttach('Khasra_Khatauni_LandRecord.pdf', '1.4 MB')}
                className="w-full flex items-center gap-2 p-1.5 rounded-lg text-left hover:bg-[#E3F2FD] text-xs text-slate-800"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#2196F3]" />
                <span className="truncate">Khasra / Khatauni (2.4 Acre)</span>
              </button>
              <button
                onClick={() => handleQuickAttach('Aadhaar_eKYC_Card.pdf', '0.8 MB')}
                className="w-full flex items-center gap-2 p-1.5 rounded-lg text-left hover:bg-[#E3F2FD] text-xs text-slate-800"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#4CAF50]" />
                <span className="truncate">Aadhaar eKYC Document</span>
              </button>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />

        {/* Input Capsule */}
        <div className="bg-[#F0F4F9] sm:bg-white rounded-full border border-slate-200/90 shadow-[0_4px_24px_rgba(26,35,126,0.06)] px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 transition-all focus-within:ring-2 focus-within:ring-[#2196F3]/30 focus-within:border-[#2196F3] focus-within:bg-white">
          {/* Document Attachment Button */}
          <button
            id="chat-attach-doc-btn"
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-1.5 sm:p-2 rounded-full text-slate-500 hover:text-[#1A237E] hover:bg-slate-100 transition-colors shrink-0 focus:outline-none"
            title="Attach Document / दस्तावेज जोड़ें"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input Field */}
          <input
            id="chat-query-input"
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={
              isHindi
                ? 'योजना के बारे में पूछें, या अपनी स्थिति बताएं...'
                : 'Ask about a scheme, or describe your situation...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none min-w-0"
          />

          {/* Microphone Voice Button */}
          {voiceEnabled && (
            <button
              id="chat-mic-btn"
              type="button"
              onClick={() => setIsListening(!isListening)}
              className={`p-1.5 sm:p-2 rounded-full transition-colors shrink-0 focus:outline-none ${
                isListening
                  ? 'text-[#2196F3] bg-[#E3F2FD] animate-pulse'
                  : 'text-slate-500 hover:text-[#1A237E] hover:bg-slate-100'
              }`}
              title="Voice Input (Mic)"
            >
              {isListening ? <Mic className="w-5 h-5 text-[#2196F3]" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          {/* Send Button */}
          <button
            id="chat-send-btn"
            type="button"
            onClick={() => sendMessage()}
            disabled={!inputText.trim() && !attachedFile}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
              inputText.trim() || attachedFile
                ? 'bg-[#2196F3] text-white hover:bg-[#1976D2] active:scale-95 shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
