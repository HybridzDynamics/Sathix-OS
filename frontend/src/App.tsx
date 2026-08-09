import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JourneyState, ChatMessage, JourneyStep } from './types';
import { AIOrb } from './components/AIOrb';
import { VoiceDock } from './components/VoiceDock';
import { ConversationCanvas } from './components/ConversationCanvas';
import { AnimatedRoadmap } from './components/AnimatedRoadmap';
import { SmartChips } from './components/SmartChips';
import { Fingerprint } from 'lucide-react';

export const App: React.FC = () => {
  const [journeyState, setJourneyState] = useState<JourneyState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roadmapSteps, setRoadmapSteps] = useState<JourneyStep[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  // Initial Greeting
  useEffect(() => {
    setTimeout(() => {
      setMessages([{
        id: 'msg-greeting',
        sender: 'ai',
        text: 'Namaste! 🙏 I am SathiX, your digital government companion. Tell me a bit about yourself, or what you need help with.',
        timestamp: new Date().toISOString()
      }]);
      setShowOptions(true);
    }, 1000);
  }, []);

  const handleSendMessage = (text: string) => {
    // Add user message
    const newMsg: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    setShowOptions(false);
    
    // Trigger thinking state
    setJourneyState('thinking');

    // Simulate AI pipeline
    setTimeout(() => {
      if (text.toLowerCase().includes('farmer')) {
        setJourneyState('interview');
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: 'I understand you are a farmer. To check your eligibility for PM-KISAN (₹6,000/year) and MUDRA loans, I need to verify your landholding and income.',
          timestamp: new Date().toISOString()
        }]);
        // Trigger roadmap generation after a slight delay
        setTimeout(() => {
          setJourneyState('roadmap');
          setRoadmapSteps([
            { id: 'rs-1', title: 'Language & Profile Detected', description: 'Farmer, Hindi/English preference.', status: 'completed' },
            { id: 'rs-2', title: 'Aadhaar e-KYC Validation', description: 'Please authenticate using your fingerprint or OTP.', status: 'active', actionLabel: 'Scan Biometrics' },
            { id: 'rs-3', title: 'Land Record Verification (Khatauni)', description: 'AI will cross-check with state revenue database.', status: 'pending' },
            { id: 'rs-4', title: 'Benefit Disbursal Setup', description: 'Direct transfer to Aadhaar-seeded account.', status: 'pending' }
          ]);
        }, 3000);
      } else {
        setJourneyState('idle');
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: 'I can help with that. Could you provide a bit more detail? Are you looking for health insurance, housing, or educational scholarships?',
          timestamp: new Date().toISOString()
        }]);
        setShowOptions(true);
      }
    }, 2000);
  };

  const handleVoiceToggle = () => {
    if (journeyState === 'listening') {
      setJourneyState('idle');
    } else {
      setJourneyState('listening');
      // Auto-simulate voice input completion for demo
      setTimeout(() => {
        handleSendMessage("I am a farmer looking for schemes.");
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#02050A] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Immersive Background: Dynamic mesh / particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep ambient glow */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px]"
          animate={{
            scale: journeyState === 'thinking' ? [1, 1.2, 1] : 1,
            opacity: journeyState === 'listening' ? 0.5 : 0.3
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]"
          animate={{
            scale: journeyState === 'thinking' ? [1, 1.5, 1] : 1,
            opacity: journeyState === 'listening' ? 0.3 : 0.2
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Subtle Grid overlay for 'OS' feel */}
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      {/* Top Status Bar (Minimalist) */}
      <header className="absolute top-0 w-full px-6 py-4 flex justify-between items-center z-50 text-white/40 text-xs font-medium uppercase tracking-widest pointer-events-none">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-cyan-500/50" />
          <span>SathiX OS // Neural Core</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${journeyState === 'offline' ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></span>
            System Online
          </span>
          <span>10:00 AM IST</span>
        </div>
      </header>

      {/* The Central AI Orb */}
      <AIOrb state={journeyState} />

      {/* Conversation Layer */}
      <ConversationCanvas messages={messages} />

      {/* Smart Options Layer (Floats above canvas) */}
      <AnimatePresence>
        {showOptions && journeyState === 'idle' && (
          <motion.div 
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <SmartChips 
              options={["I am a farmer", "Senior citizen pension", "Student scholarships", "Women entrepreneur loans"]}
              onSelect={handleSendMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roadmap Overlay */}
      <AnimatePresence>
        {journeyState === 'roadmap' && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pt-20 pb-32 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatedRoadmap steps={roadmapSteps} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Command Dock */}
      <VoiceDock 
        onSendMessage={handleSendMessage}
        onVoiceToggle={handleVoiceToggle}
        isListening={journeyState === 'listening'}
      />

    </div>
  );
};

export default App;
