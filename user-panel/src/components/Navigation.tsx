import React, { useState } from 'react';
import { 
  Home, 
  Compass, 
  FileText, 
  Bookmark, 
  User, 
  ShieldCheck, 
  History as HistoryIcon,
  SquarePen, 
  Search, 
  PanelLeftClose, 
  PanelLeftOpen, 
  PanelLeft, 
  Pin, 
  Trash2, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { NavTab, Language, UserProfile, ChatSession } from '../types';
import { translations } from '../utils/translations';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
  pendingApplicationsCount: number;
  savedCount: number;
  user: UserProfile;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  chatSessions: ChatSession[];
  activeSessionId?: string | null;
  onSelectChatSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteChatSession: (sessionId: string) => void;
  onTogglePinSession: (sessionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  language,
  pendingApplicationsCount,
  savedCount,
  user,
  isSidebarOpen,
  onToggleSidebar,
  chatSessions,
  activeSessionId,
  onSelectChatSession,
  onNewChat,
  onDeleteChatSession,
  onTogglePinSession,
}) => {
  const [filterSearch, setFilterSearch] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);

  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'history', label: t.nav.history || (isHindi ? 'इतिहास' : 'History'), icon: HistoryIcon, badge: chatSessions.length },
    { id: 'explore', label: t.nav.explore, icon: Compass },
    { id: 'applications', label: t.nav.applications, icon: FileText, badge: pendingApplicationsCount },
    { id: 'saved', label: t.nav.saved, icon: Bookmark, badge: savedCount },
    { id: 'profile', label: t.nav.profile, icon: User },
  ];

  // Filtered sessions for sidebar list
  const filteredSessions = chatSessions.filter(s => {
    const title = isHindi && s.titleHindi ? s.titleHindi : s.title;
    return title.toLowerCase().includes(filterSearch.toLowerCase());
  });

  const pinnedSessions = filteredSessions.filter(s => s.pinned);
  const recentSessions = filteredSessions.filter(s => !s.pinned);

  return (
    <>
      {/* ================= MOBILE OVERLAY BACKDROP ================= */}
      {isSidebarOpen && (
        <div 
          onClick={onToggleSidebar}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* ================= COLLAPSED FLOATING SIDEBAR TOGGLE (When Closed on Desktop/Mobile) ================= */}
      {!isSidebarOpen && (
        <div className="fixed top-3 left-3 z-30 flex items-center gap-1.5 animate-in fade-in duration-200">
          <button
            id="open-sidebar-btn"
            onClick={onToggleSidebar}
            title={isHindi ? 'साइडबार खोलें (Open sidebar)' : 'Open sidebar'}
            className="p-2.5 rounded-xl bg-white text-slate-700 hover:text-[#1A237E] hover:bg-slate-100 border border-slate-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 active:scale-95 group flex items-center gap-1.5"
          >
            <PanelLeft className="w-5 h-5 text-slate-700 group-hover:text-[#1A237E]" />
            <span className="hidden sm:inline text-xs font-semibold text-slate-700">
              {isHindi ? 'मेनू' : 'Menu'}
            </span>
          </button>

          {/* Quick New Chat Button when collapsed */}
          <button
            id="collapsed-new-chat-btn"
            onClick={() => {
              onNewChat();
              if (currentTab !== 'home') onSelectTab('home');
            }}
            title={isHindi ? 'नई चैट (+ New Chat)' : 'New Chat'}
            className="p-2.5 rounded-xl bg-white text-slate-700 hover:text-[#2196F3] hover:bg-[#E3F2FD] border border-slate-200 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30 active:scale-95"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= CHATGPT-STYLE VERTICAL LEFT SIDEBAR ================= */}
      <aside
        id="chatgpt-sidebar"
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 bg-[#FBFBFB] border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 select-none shadow-xl lg:shadow-none ${
          isSidebarOpen
            ? 'w-72 sm:w-80 translate-x-0'
            : '-translate-x-full lg:w-0 lg:overflow-hidden lg:border-r-0 lg:p-0'
        }`}
      >
        {/* ================= TOP SECTION: BRAND & NEW CHAT ================= */}
        <div className="flex flex-col p-3.5 pb-2 shrink-0">
          {/* Header Row: SarthixOS Branding, Search trigger & Close sidebar button */}
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 mb-2">
            <div 
              onClick={() => {
                onSelectTab('home');
                onNewChat();
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1A237E] text-white flex items-center justify-center font-black text-base shadow-xs group-hover:bg-[#283593] transition-colors">
                S
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#1A237E] text-base tracking-tight">SarthixOS</span>
                <span className="text-[10px] font-bold bg-[#E3F2FD] text-[#1565C0] px-1.5 py-0.5 rounded border border-[#BBDEFB]">
                  AI
                </span>
              </div>
            </div>

            {/* Top Right Controls (Search toggle + Close Sidebar) */}
            <div className="flex items-center gap-1">
              <button
                id="sidebar-search-toggle-btn"
                onClick={() => setIsSearchActive(!isSearchActive)}
                title={isHindi ? 'चैट खोजें' : 'Search chats'}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                id="close-sidebar-btn"
                onClick={onToggleSidebar}
                title={isHindi ? 'साइडबार बंद करें (Close sidebar)' : 'Close sidebar'}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inline Chat Search Input (when toggled) */}
          {isSearchActive && (
            <div className="mb-2 px-1 animate-in fade-in duration-150">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder={isHindi ? 'चैट इतिहास खोजें...' : 'Search chat history...'}
                  className="w-full pl-8 pr-7 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2196F3]"
                  autoFocus
                />
                {filterSearch && (
                  <button
                    onClick={() => setFilterSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ChatGPT-style "+ New chat" Button */}
          <button
            id="sidebar-new-chat-btn"
            onClick={() => {
              onNewChat();
              if (currentTab !== 'home') onSelectTab('home');
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100/90 text-slate-800 border border-slate-200/80 shadow-2xs font-medium text-xs sm:text-sm transition-all duration-150 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <SquarePen className="w-4 h-4 text-slate-600 group-hover:text-[#1A237E]" />
              <span className="font-semibold text-slate-800 group-hover:text-[#1A237E]">
                {isHindi ? 'नई चैट' : 'New chat'}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50">
              Ctrl + N
            </span>
          </button>
        </div>

        {/* ================= MIDDLE SCROLLABLE SECTION: NAV ITEMS & CHAT HISTORY ================= */}
        <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {/* Main App Navigation Tabs */}
          <div>
            <div className="px-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'सुविधाएं' : 'Navigation'}
            </div>
            <nav className="space-y-0.5" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => {
                      onSelectTab(item.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors group ${
                      isActive
                        ? 'bg-[#E3F2FD] text-[#1A237E] font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#2196F3] stroke-[2.2]' : 'text-slate-500 group-hover:text-slate-700'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-[#2196F3] text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ================= CHATGPT-STYLE PINNED CONVERSATIONS ================= */}
          {pinnedSessions.length > 0 && (
            <div>
              <div className="px-2 pb-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Pin className="w-3 h-3 text-[#2196F3]" />
                <span>{isHindi ? 'पिन की गई चैट' : 'Pinned'}</span>
              </div>

              <div className="space-y-0.5">
                {pinnedSessions.map((session) => {
                  const isActive = currentTab === 'home' && activeSessionId === session.id;
                  const isHovered = hoveredSessionId === session.id;

                  return (
                    <div
                      key={session.id}
                      onMouseEnter={() => setHoveredSessionId(session.id)}
                      onMouseLeave={() => setHoveredSessionId(null)}
                      className={`relative flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs transition-colors group cursor-pointer ${
                        isActive
                          ? 'bg-[#E3F2FD] text-[#1A237E] font-semibold'
                          : 'text-slate-700 hover:bg-slate-100/90'
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectChatSession(session);
                          if (currentTab !== 'home') onSelectTab('home');
                        }}
                        className="flex items-center gap-2 text-left min-w-0 flex-1 py-0.5 focus:outline-none"
                      >
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2196F3]' : 'text-slate-400'}`} />
                        <span className="truncate text-xs font-normal">
                          {isHindi && session.titleHindi ? session.titleHindi : session.title}
                        </span>
                      </button>

                      {/* Quick Actions (Unpin / Delete) on Hover or Active */}
                      {(isHovered || isActive) && (
                        <div className="flex items-center gap-0.5 shrink-0 pl-1 animate-in fade-in duration-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePinSession(session.id);
                            }}
                            title="Unpin chat"
                            className="p-1 text-[#2196F3] hover:bg-blue-100 rounded-md"
                          >
                            <Pin className="w-3 h-3 fill-[#2196F3]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChatSession(session.id);
                            }}
                            title="Delete chat"
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= CHATGPT-STYLE RECENTS CONVERSATIONS ================= */}
          <div>
            <div className="px-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'हालिया चैट' : 'Recents'}
            </div>

            {recentSessions.length === 0 ? (
              <div className="px-2 py-2 text-xs text-slate-400 italic">
                {isHindi ? 'कोई पिछली चैट नहीं' : 'No recent chats'}
              </div>
            ) : (
              <div className="space-y-0.5">
                {recentSessions.map((session) => {
                  const isActive = currentTab === 'home' && activeSessionId === session.id;
                  const isHovered = hoveredSessionId === session.id;

                  return (
                    <div
                      key={session.id}
                      onMouseEnter={() => setHoveredSessionId(session.id)}
                      onMouseLeave={() => setHoveredSessionId(null)}
                      className={`relative flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs transition-colors group cursor-pointer ${
                        isActive
                          ? 'bg-[#E3F2FD] text-[#1A237E] font-semibold'
                          : 'text-slate-700 hover:bg-slate-100/90'
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectChatSession(session);
                          if (currentTab !== 'home') onSelectTab('home');
                        }}
                        className="flex items-center gap-2 text-left min-w-0 flex-1 py-0.5 focus:outline-none"
                      >
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2196F3]' : 'text-slate-400'}`} />
                        <span className="truncate text-xs font-normal">
                          {isHindi && session.titleHindi ? session.titleHindi : session.title}
                        </span>
                      </button>

                      {/* Quick Actions (Pin / Delete) on Hover or Active */}
                      {(isHovered || isActive) && (
                        <div className="flex items-center gap-0.5 shrink-0 pl-1 animate-in fade-in duration-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePinSession(session.id);
                            }}
                            title="Pin chat"
                            className="p-1 text-slate-400 hover:text-[#2196F3] hover:bg-blue-50 rounded-md"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChatSession(session.id);
                            }}
                            title="Delete chat"
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= BOTTOM USER PROFILE PILL (LIKE CHATGPT PROFILE) ================= */}
        <div className="p-3 border-t border-slate-200/80 shrink-0 bg-[#F8F9FA]/60">
          <button
            id="sidebar-user-profile-pill"
            onClick={() => onSelectTab('profile')}
            className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-slate-200/60 transition-colors text-left group focus:outline-none"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 shadow-2xs bg-slate-200 shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4CAF50] border-2 border-white rounded-full"></span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                  <span>{user.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF50] shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></span>
                  <span>eKYC Verified • Citizen</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
