import React, { useState, useMemo, useEffect } from 'react';
import { 
  NavTab, 
  Language, 
  Scheme, 
  Application, 
  UserProfile,
  ChatSession,
  ChatMessage,
  AccessibilitySettings,
  TextSize
} from './types';
import { 
  currentUser, 
  allSchemes, 
  initialApplications, 
  savedSchemeIds as initialSavedIds 
} from './data/schemes';
import { initialChatSessions } from './data/chatHistory';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/views/HomeView';
import { HistoryView } from './components/views/HistoryView';
import { ExploreView } from './components/views/ExploreView';
import { ApplicationsView } from './components/views/ApplicationsView';
import { SavedView } from './components/views/SavedView';
import { ProfileView } from './components/views/ProfileView';
import { AccessibilityView } from './components/views/AccessibilityView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { LanguagePickerModal } from './components/LanguagePickerModal';
import { calculateSchemeMatch } from './utils/schemeMatcher';
import { Check } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<UserProfile>(currentUser);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Global Accessibility Settings (Persisted in state across navigation)
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    textSize: 'M',
    highContrast: false,
    reducedMotion: false,
    screenReaderFriendly: false,
    voiceInteraction: true,
    simplifiedLanguage: false,
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  // Apply HTML attributes & root classes for global text size, high-contrast, and reduced-motion
  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', accessibilitySettings.textSize);
    if (accessibilitySettings.highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }

    if (accessibilitySettings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion-mode');
    } else {
      document.documentElement.classList.remove('reduced-motion-mode');
    }
  }, [accessibilitySettings]);

  // Recalculate dynamic match percentages for schemes automatically whenever user profile updates
  const dynamicSchemes: Scheme[] = useMemo(() => {
    return allSchemes.map((s) => {
      const match = calculateSchemeMatch(s, user);
      return {
        ...s,
        matchPercentage: match.percentage,
        matchReason: match.reason,
      };
    });
  }, [user]);

  const [savedIds, setSavedIds] = useState<string[]>(initialSavedIds);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  
  // Collapsible sidebar state & chat sessions history
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(initialChatSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [audioNarrationActive, setAudioNarrationActive] = useState<boolean>(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Update user profile fields (from ProfileView inline edit or additional details modal)
  const handleUpdateUser = (updatedFields: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // Update accessibility settings
  const handleUpdateAccessibilitySettings = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
    showToast(language === 'hi' ? 'सुगमता सेटिंग्स अपडेट की गईं' : 'Accessibility settings updated');
  };

  // Find active chat session
  const activeChatSession = chatSessions.find((s) => s.id === activeSessionId) || null;

  // Toggle Sidebar Collapse/Open
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Start fresh chat
  const handleNewChat = () => {
    setActiveSessionId(null);
    setCurrentTab('home');
    showToast(language === 'hi' ? 'नई चैट शुरू की गई' : 'New chat started');
  };

  // Select existing session from History or Sidebar
  const handleSelectChatSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setCurrentTab('home');
  };

  // Delete chat session
  const handleDeleteChatSession = (sessionId: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
    showToast(language === 'hi' ? 'चैट हटा दी गई' : 'Chat deleted from history');
  };

  // Toggle Pin chat session
  const handleTogglePinSession = (sessionId: string) => {
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const newPinned = !s.pinned;
          showToast(newPinned ? 'Chat pinned to top' : 'Chat unpinned');
          return { ...s, pinned: newPinned };
        }
        return s;
      })
    );
  };

  // Ask Sarthix about a specific scheme
  const handleAskSarthixAboutScheme = (scheme: Scheme) => {
    setIsDetailModalOpen(false);
    setCurrentTab('home');

    const isHindi = language === 'hi';
    const title = isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTime = isHindi ? `आज, ${timeStr}` : `Today, ${timeStr}`;

    const welcomeMsg: ChatMessage = {
      id: `msg-ai-scheme-${Date.now()}`,
      sender: 'assistant',
      timestamp: formattedTime,
      text: isHindi
        ? `आइए "${title}" के बारे में बात करते हैं। आप इस योजना के बारे में क्या जानना चाहते हैं? मैं पात्रता मानदंड, आवश्यक दस्तावेज (${scheme.documentsRequired.length} दस्तावेज), या आवेदन प्रक्रिया में आपकी सहायता कर सकता हूँ।`
        : `Let's talk about ${scheme.title}. What would you like to know? I can help you with eligibility criteria, required documents, benefits (${scheme.benefitAmount}), or step-by-step application assistance.`,
      recommendedSchemeIds: [scheme.id],
    };

    const newSessionId = `session-scheme-${scheme.id}-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: `${scheme.title}`,
      titleHindi: `${scheme.titleHindi || scheme.title}`,
      updatedAt: 'Just now',
      preview: `Discussion regarding ${scheme.title}`,
      messages: [welcomeMsg],
      pinned: false,
      category: 'Scheme Consultation',
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    showToast(isHindi ? `सारथी के साथ ${title} पर चर्चा शुरू` : `Started chat for ${scheme.title}`);
  };

  // Update or Create session messages when user chats
  const handleUpdateSessionMessages = (messages: ChatMessage[], firstQuery?: string) => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    const previewText = latestMessage.text.slice(0, 80) + (latestMessage.text.length > 80 ? '...' : '');

    if (activeSessionId) {
      setChatSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: messages,
              preview: previewText,
              updatedAt: 'Just now',
            };
          }
          return s;
        })
      );
    } else {
      const title = firstQuery
        ? firstQuery.length > 40
          ? firstQuery.slice(0, 38) + '...'
          : firstQuery
        : 'Scheme Consultation';

      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: title,
        titleHindi: title,
        updatedAt: 'Just now',
        preview: previewText,
        messages: messages,
        pinned: false,
        category: 'General',
      };

      setChatSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }
  };

  const handleToggleSave = (schemeId: string) => {
    if (savedIds.includes(schemeId)) {
      setSavedIds(savedIds.filter((id) => id !== schemeId));
      showToast(language === 'hi' ? 'योजना सहेजे गए से हटा दी गई' : 'Scheme removed from saved');
    } else {
      setSavedIds([...savedIds, schemeId]);
      showToast(language === 'hi' ? 'योजना सफलतापूर्वक सहेजी गई' : 'Scheme saved to your list');
    }
  };

  const handleViewSchemeDetails = (scheme: Scheme) => {
    // Look up dynamic version of this scheme
    const currentScheme = dynamicSchemes.find(s => s.id === scheme.id) || scheme;
    setSelectedScheme(currentScheme);
    setIsDetailModalOpen(true);
  };

  const handleViewSchemeDetailsById = (schemeId: string) => {
    const s = dynamicSchemes.find((item) => item.id === schemeId) || allSchemes.find((item) => item.id === schemeId);
    if (s) {
      setSelectedScheme(s);
      setIsDetailModalOpen(true);
    }
  };

  const handleApplyScheme = (scheme: Scheme) => {
    const currentScheme = dynamicSchemes.find(s => s.id === scheme.id) || scheme;
    setSelectedScheme(currentScheme);
    setIsDetailModalOpen(true);
  };

  const handleSubmitApplication = (scheme: Scheme) => {
    const existing = applications.find((a) => a.schemeId === scheme.id);
    if (!existing) {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        schemeId: scheme.id,
        schemeTitle: scheme.title,
        schemeTitleHindi: scheme.titleHindi,
        referenceNumber: `SAR-${Math.floor(100000 + Math.random() * 900000)}`,
        appliedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'pending',
        currentStep: 1,
        totalSteps: 3,
        statusDescription: 'Application received & under initial automated verification',
        statusDescriptionHindi: 'आवेदन प्राप्त हुआ व प्रारंभिक सत्यापन जारी है',
        timeline: [
          { title: 'Application Submitted Online', date: 'Today', completed: true, current: true },
          { title: 'Nodal Officer Verification', date: 'In Progress', completed: false },
          { title: 'DBT Benefit Sanction', date: 'Pending', completed: false },
        ],
      };
      setApplications([newApp, ...applications]);
      showToast(language === 'hi' ? 'आवेदन सफलतापूर्वक जमा किया गया!' : 'Application submitted successfully!');
    }
  };

  const handleSearchFromVoice = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('explore');
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-900 flex antialiased selection:bg-[#E3F2FD] selection:text-[#1A237E] overflow-x-hidden ${
      accessibilitySettings.highContrast ? 'high-contrast-mode' : ''
    } ${accessibilitySettings.reducedMotion ? 'reduced-motion-mode' : ''}`}>
      {/* ChatGPT-Style Left Collapsible Sidebar with History & Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        pendingApplicationsCount={applications.filter((a) => a.status === 'pending').length}
        savedCount={savedIds.length}
        user={user}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        chatSessions={chatSessions}
        activeSessionId={activeSessionId}
        onSelectChatSession={handleSelectChatSession}
        onNewChat={handleNewChat}
        onDeleteChatSession={handleDeleteChatSession}
        onTogglePinSession={handleTogglePinSession}
      />

      {/* Main Content Area */}
      <main 
        id="main-app-content"
        className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-3 sm:py-5 overflow-y-auto max-w-full"
        role={accessibilitySettings.screenReaderFriendly ? 'main' : undefined}
        aria-label="SarthixOS Citizen Platform"
      >
        {currentTab === 'home' && (
          <HomeView
            user={user}
            language={language}
            onLanguageChange={setLanguage}
            onOpenProfile={() => setCurrentTab('profile')}
            audioNarrationActive={audioNarrationActive}
            onToggleNarration={() => {
              setAudioNarrationActive(!audioNarrationActive);
              showToast(!audioNarrationActive ? 'Voice narration enabled' : 'Voice narration disabled');
            }}
            onViewSchemeDetails={handleViewSchemeDetails}
            onNavigateToApplications={() => setCurrentTab('applications')}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            activeSession={activeChatSession}
            onUpdateSessionMessages={handleUpdateSessionMessages}
            onNewChat={handleNewChat}
            voiceEnabled={accessibilitySettings.voiceInteraction}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            sessions={chatSessions}
            language={language}
            user={user}
            onSelectSession={handleSelectChatSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteChatSession}
            onTogglePinSession={handleTogglePinSession}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreView
            schemes={dynamicSchemes}
            language={language}
            onApplyScheme={handleApplyScheme}
            onViewSchemeDetails={handleViewSchemeDetails}
            savedSchemeIds={savedIds}
            onToggleSaveScheme={handleToggleSave}
            onOpenVoiceSearch={() => setVoiceModalOpen(true)}
            voiceEnabled={accessibilitySettings.voiceInteraction}
          />
        )}

        {currentTab === 'applications' && (
          <ApplicationsView
            applications={applications}
            language={language}
            onViewSchemeDetailsById={handleViewSchemeDetailsById}
          />
        )}

        {currentTab === 'saved' && (
          <SavedView
            schemes={dynamicSchemes}
            savedIds={savedIds}
            language={language}
            onApplyScheme={handleApplyScheme}
            onViewSchemeDetails={handleViewSchemeDetails}
            onToggleSaveScheme={handleToggleSave}
            onNavigateToExplore={() => setCurrentTab('explore')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            onUpdateUser={handleUpdateUser}
            language={language}
            onOpenLanguagePicker={() => setIsLanguageModalOpen(true)}
            onNavigateToAccessibility={() => setCurrentTab('accessibility')}
            onBack={() => setCurrentTab('home')}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'accessibility' && (
          <AccessibilityView
            settings={accessibilitySettings}
            onUpdateSettings={handleUpdateAccessibilitySettings}
            language={language}
            onOpenLanguagePicker={() => setIsLanguageModalOpen(true)}
            onBack={() => setCurrentTab('profile')}
          />
        )}
      </main>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        language={language}
        onSelectScheme={(id) => handleViewSchemeDetailsById(id)}
        onSearchQuery={handleSearchFromVoice}
      />

      {/* Connected Scheme Detail Screen / Modal */}
      <SchemeDetailModal
        scheme={selectedScheme}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        language={language}
        user={user}
        isSaved={selectedScheme ? savedIds.includes(selectedScheme.id) : false}
        onToggleSave={handleToggleSave}
        onSubmitApplication={handleSubmitApplication}
        onAskSarthix={handleAskSarthixAboutScheme}
        onShowToast={showToast}
        onNavigateToApplications={() => setCurrentTab('applications')}
      />

      {/* Synchronized Language Picker Modal */}
      <LanguagePickerModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={(newLang) => {
          setLanguage(newLang);
          showToast(newLang === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है' : `Language updated to ${newLang.toUpperCase()}`);
        }}
      />

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <div 
          id="toast-feedback"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
