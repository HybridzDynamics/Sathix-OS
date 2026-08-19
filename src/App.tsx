import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveTab, AccessibilitySettings } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { InformationHome } from './components/InformationHome';
import { AboutPage } from './components/AboutPage';
import { LegalCenter } from './components/LegalCenter';
import { SchemeExplorer } from './components/SchemeExplorer';
import { AIAssistant } from './components/AIAssistant';
import { ApplicationStatus } from './components/ApplicationStatus';
import { CitizenDashboard } from './components/CitizenDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AccessibilityCenter } from './components/AccessibilityCenter';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [activeLanguage, setActiveLanguage] = useState<string>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    dyslexicFont: false,
    voiceSpeed: 1.0,
  });

  // Render the current active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'landing': return <LandingPage setActiveTab={setActiveTab} />;
      case 'info': return <InformationHome setActiveTab={setActiveTab} />;
      case 'about': return <AboutPage setActiveTab={setActiveTab} />;
      case 'schemes': return <SchemeExplorer setActiveTab={setActiveTab} />;
      case 'assistant': return <AIAssistant setActiveTab={setActiveTab} activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} />;
      case 'status': return <ApplicationStatus setActiveTab={setActiveTab} />;
      case 'dashboard': return <CitizenDashboard setActiveTab={setActiveTab} />;
      case 'admin': return <AdminDashboard />;
      case 'accessibility': return <AccessibilityCenter settings={settings} setSettings={setSettings} activeLanguage={activeLanguage} setActiveLanguage={setActiveLanguage} highContrast={highContrast} setHighContrast={setHighContrast} />;
      case 'legal': return <LegalCenter setActiveTab={setActiveTab} />;
      default: return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-200 ${highContrast ? 'bg-white text-black' : 'bg-white text-slate-900'}`}>
      


      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activeLanguage={activeLanguage} 
          setActiveLanguage={setActiveLanguage}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
        />
        
        <main className="flex-grow relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
