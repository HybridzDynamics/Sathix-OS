import React, { useState } from 'react';
import { 
  ChatSession, 
  Language, 
  UserProfile 
} from '../../types';
import { 
  Search, 
  MessageSquare, 
  Pin, 
  Trash2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Filter,
  CheckCircle2
} from 'lucide-react';

interface HistoryViewProps {
  sessions: ChatSession[];
  language: Language;
  user: UserProfile;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onTogglePinSession: (sessionId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  sessions,
  language,
  user,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onTogglePinSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isHindi = language === 'hi';

  const categories = [
    { id: 'all', label: isHindi ? 'सभी' : 'All Consultations' },
    { id: 'Agriculture', label: isHindi ? 'कृषि' : 'Agriculture' },
    { id: 'Health', label: isHindi ? 'स्वास्थ्य' : 'Health' },
    { id: 'Energy', label: isHindi ? 'ऊर्जा' : 'Energy & Solar' },
    { id: 'Banking', label: isHindi ? 'बैंकिंग व ऋण' : 'Banking & Loans' },
  ];

  const filteredSessions = sessions.filter((session) => {
    const titleMatch = (isHindi && session.titleHindi ? session.titleHindi : session.title)
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      session.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

    const categoryMatch = selectedCategory === 'all' || session.category === selectedCategory;

    return titleMatch && categoryMatch;
  });

  const pinnedSessions = filteredSessions.filter(s => s.pinned);
  const recentSessions = filteredSessions.filter(s => !s.pinned);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_4px_24px_rgba(26,35,126,0.04)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#1A237E] uppercase tracking-wider bg-[#E3F2FD] px-2.5 py-0.5 rounded-full">
              {isHindi ? 'वार्तालाप इतिहास' : 'Chat & Consultation History'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A237E] tracking-tight">
            {isHindi ? 'एआई योजना इतिहास' : 'Chat History'}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            {isHindi
              ? 'आपकी पिछली सभी सरकारी योजना पूछताछ, पात्रता जांच और मार्गदर्शन सुरक्षित रूप से संरक्षित हैं।'
              : 'Review your past conversations with Sarthix AI, eligibility audits, and scheme recommendations.'}
          </p>
        </div>

        <button
          id="history-start-new-chat-btn"
          onClick={onNewChat}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1A237E] text-white hover:bg-[#283593] transition-all shadow-md shadow-[#1A237E]/20 text-sm font-bold active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isHindi ? '+ नई चैट शुरू करें' : '+ New Chat'}</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="history-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'बातचीत या योजना खोजें...' : 'Search past chats, schemes, or topics...'}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 focus:border-[#2196F3] shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1A237E] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Content */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {isHindi ? 'कोई बातचीत नहीं मिली' : 'No chats found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {isHindi
              ? 'आपके खोज मानदंडों से मेल खाने वाला कोई पिछला वार्तालाप नहीं है।'
              : 'Try searching with different keywords or start a new conversation with Sarthix.'}
          </p>
          <button
            onClick={onNewChat}
            className="mt-4 px-4 py-2 bg-[#2196F3] text-white text-xs font-bold rounded-xl hover:bg-[#1976D2] transition-colors"
          >
            {isHindi ? 'नई चैट शुरू करें' : 'Start a New Chat'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Chats Section */}
          {pinnedSessions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                <Pin className="w-3.5 h-3.5 text-[#2196F3]" />
                <span>{isHindi ? 'पिन की गई बातचीत' : 'Pinned Consultations'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {pinnedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-100 shadow-[0_2px_12px_rgba(33,150,243,0.06)] hover:shadow-[0_4px_20px_rgba(33,150,243,0.12)] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#2196F3]"></span>
                          {session.category && (
                            <span className="text-[11px] font-semibold text-[#1A237E] bg-[#E3F2FD] px-2 py-0.5 rounded-md">
                              {session.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onTogglePinSession(session.id)}
                            title="Unpin chat"
                            className="p-1 text-[#2196F3] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Pin className="w-3.5 h-3.5 fill-[#2196F3]" />
                          </button>
                          <button
                            onClick={() => onDeleteSession(session.id)}
                            title="Delete chat"
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 
                        onClick={() => onSelectSession(session)}
                        className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1A237E] transition-colors cursor-pointer"
                      >
                        {isHindi && session.titleHindi ? session.titleHindi : session.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {session.preview}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.updatedAt}
                      </span>
                      <button
                        onClick={() => onSelectSession(session)}
                        className="text-xs font-bold text-[#2196F3] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>{isHindi ? 'चैट खोलें' : 'Resume Chat'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Chats Section */}
          {recentSessions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{isHindi ? 'हालिया बातचीत' : 'Recent Consultations'}</span>
              </div>

              <div className="space-y-2.5">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(26,35,126,0.03)] hover:shadow-[0_4px_16px_rgba(26,35,126,0.06)] hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div 
                      onClick={() => onSelectSession(session)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {session.category && (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {session.category}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {session.updatedAt} • {session.messages.length} messages
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1A237E] transition-colors truncate">
                        {isHindi && session.titleHindi ? session.titleHindi : session.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {session.preview}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => onTogglePinSession(session.id)}
                        title="Pin chat"
                        className="p-2 text-slate-400 hover:text-[#2196F3] hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSession(session.id)}
                        title="Delete chat"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSelectSession(session)}
                        className="px-3.5 py-2 bg-[#F8F9FA] hover:bg-[#E3F2FD] text-[#1A237E] rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>{isHindi ? 'खोलें' : 'Open'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
