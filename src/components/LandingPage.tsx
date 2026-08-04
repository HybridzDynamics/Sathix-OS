import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  Bot, 
  Search, 
  Mic, 
  Languages, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Building2,
  Volume2
} from 'lucide-react';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const [activePreviewQuery, setActivePreviewQuery] = useState(0);

  const previewQueries = [
    {
      q: "Am I eligible for PM-KISAN scheme?",
      a: "Yes Ramesh ji! You qualify for ₹6,000/yr direct bank transfer as a land-holding farmer with income under ₹2 Lakh. Your Aadhaar e-KYC is 100% verified.",
      badge: "Eligibility: 99.4% Match"
    },
    {
      q: "How to get ₹5 Lakh Ayushman Bharat Golden Card?",
      a: "Upload your Ration Card or Aadhaar. Our AI automatically matches your family tree with SECC data to generate your instant digital Golden Health Card.",
      badge: "Instant Approval"
    },
    {
      q: "What loans can I get to start a small tailoring business?",
      a: "Under PM Vishwakarma & MUDRA Yojana, you get a ₹15,000 Toolkit incentive + up to ₹3 Lakh collateral-free loan at just 5% interest rate.",
      badge: "Zero Collateral"
    }
  ];

  const features = [
    {
      icon: Bot,
      color: 'from-cyan-500 to-blue-600',
      title: 'AI Citizen Assistant',
      desc: 'Ask complex government rules in plain conversational language. Get step-by-step guidance tailored to your profile.'
    },
    {
      icon: Languages,
      color: 'from-emerald-500 to-teal-600',
      title: 'Multilingual Support',
      desc: 'Available in 12+ official Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, Punjabi, etc.).'
    },
    {
      icon: Mic,
      color: 'from-purple-500 to-pink-600',
      title: 'Voice Accessibility',
      desc: 'Designed for non-literate and elderly citizens. Speak your query naturally and listen to voice answers.'
    },
    {
      icon: Sparkles,
      color: 'from-amber-500 to-orange-600',
      title: 'Smart Recommendations',
      desc: 'Instant eligibility matching matrix analyzing age, occupation, location, and income to find every scheme you deserve.'
    },
    {
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      title: 'Document Guidance',
      desc: 'AI document scanner verifies your Aadhaar, Ration Card & Income certificate completeness before official submission.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 animate-fade-in shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next Generation Digital India Citizen Operating System</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Simplifying Government Services{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              With AI
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            SathiX OS helps citizens discover schemes, understand eligibility, and access government services in their own language.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setActiveTab('assistant')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center justify-center space-x-3 group"
            >
              <Bot className="w-5 h-5 text-slate-950" />
              <span>Start Assistant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('schemes')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white font-bold text-base hover:bg-slate-800 hover:border-cyan-400 transition-all flex items-center justify-center space-x-3 backdrop-blur-md"
            >
              <Search className="w-5 h-5 text-cyan-400" />
              <span>Explore Schemes</span>
            </button>
          </div>

          {/* Live Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md">
            <div className="p-3 text-center border-r border-slate-800/60 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">500+</div>
              <div className="text-xs text-slate-400 mt-1">Central & State Schemes</div>
            </div>
            <div className="p-3 text-center border-r border-slate-800/60 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">12+</div>
              <div className="text-xs text-slate-400 mt-1">Indian Languages Supported</div>
            </div>
            <div className="p-3 text-center border-r border-slate-800/60 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-purple-400">99.4%</div>
              <div className="text-xs text-slate-400 mt-1">AI Eligibility Accuracy</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">₹0</div>
              <div className="text-xs text-slate-400 mt-1">Free Citizen Platform</div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive AI Preview Card */}
      <section className="py-12 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live AI Assistant Experience</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">Try Asking SathiX OS</h2>
          </div>

          {/* Interactive Mock Card */}
          <div className="bg-[#0E1526] rounded-2xl border border-cyan-500/30 p-6 shadow-2xl backdrop-blur-xl">
            
            {/* Prompt Selector Pills */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {previewQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePreviewQuery(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    activePreviewQuery === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {item.q}
                </button>
              ))}
            </div>

            {/* Answer Display */}
            <div className="bg-[#080D1A] rounded-xl p-5 border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-cyan-300">SathiX AI Voice & Text Engine</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {previewQueries[activePreviewQuery].badge}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">
                {previewQueries[activePreviewQuery].a}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Volume2 className="w-4 h-4 text-cyan-400 cursor-pointer hover:text-cyan-300" />
                  <span>Listen in Hindi / Local Dialect</span>
                </div>
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <span>Open Full Chatbot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5 Core Feature Pillars Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built For Every Indian Citizen
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Removing bureaucracy and digital barriers through human-centric AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="group relative bg-[#0E1424]/80 rounded-2xl border border-slate-800 p-6 hover:border-cyan-500/50 hover:bg-[#121B30] transition-all duration-300 shadow-lg hover:shadow-cyan-500/10"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-5 shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#0B0F1D] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">3 Easy Steps</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">How SathiX OS Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#070B14] p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-white mb-2">Speak or Type</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tell the assistant your age, occupation, or what assistance you need in any Indian language.
              </p>
            </div>

            <div className="bg-[#070B14] p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Eligibility Scan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                SathiX OS scans over 500+ Central and State databases to find matching subsidies, health insurance, or loans.
              </p>
            </div>

            <div className="bg-[#070B14] p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-white mb-2">1-Click Guided Application</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive auto-filled document checklists, local CSC location guidance, and real-time status updates on your phone.
              </p>
            </div>
          </div>

          {/* Bottom Banner CTA */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-cyan-900/60 via-blue-900/40 to-indigo-900/60 border border-cyan-500/40 p-8 text-center sm:flex items-center justify-between gap-6">
            <div className="text-left mb-4 sm:mb-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Ready to check your government benefits?</h3>
              <p className="text-xs sm:text-sm text-cyan-200 mt-1">No registration needed for quick scheme eligibility lookup.</p>
            </div>
            <button
              onClick={() => setActiveTab('assistant')}
              className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-sm hover:bg-cyan-300 transition shadow-lg whitespace-nowrap"
            >
              Open AI Assistant Now
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
