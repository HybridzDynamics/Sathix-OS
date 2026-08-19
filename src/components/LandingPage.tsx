import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  Bot, 
  Search, 
  Mic, 
  Languages, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Volume2,
  ChevronRight
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
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      title: 'AI Citizen Assistant',
      desc: 'Ask complex government rules in plain conversational language. Get step-by-step guidance tailored to your profile.'
    },
    {
      icon: Languages,
      color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      title: 'Multilingual Support',
      desc: 'Available in 12+ official Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, Punjabi, etc.).'
    },
    {
      icon: Mic,
      color: 'bg-purple-100 text-purple-600 border-purple-200',
      title: 'Voice Accessibility',
      desc: 'Designed for non-literate and elderly citizens. Speak your query naturally and listen to voice answers.'
    },
    {
      icon: Sparkles,
      color: 'bg-amber-100 text-amber-600 border-amber-200',
      title: 'Smart Recommendations',
      desc: 'Instant eligibility matching matrix analyzing age, occupation, location, and income to find every scheme you deserve.'
    },
    {
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      title: 'Document Guidance',
      desc: 'AI document scanner verifies your Aadhaar, Ration Card & Income certificate completeness before official submission.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6 text-slate-900">
            Simplifying Government Services
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            SathiX OS helps citizens discover schemes, understand eligibility, and access government services easily in their own language.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setActiveTab('assistant')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-base shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 group"
            >
              <Bot className="w-5 h-5 text-white" />
              <span>Start Assistant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('schemes')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-base hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center space-x-3"
            >
              <Search className="w-5 h-5 text-slate-400" />
              <span>Explore Schemes</span>
            </button>
          </div>

          {/* Live Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="p-3 text-center border-r border-slate-100 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">500+</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Central & State Schemes</div>
            </div>
            <div className="p-3 text-center border-r border-slate-100 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">12+</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Indian Languages Supported</div>
            </div>
            <div className="p-3 text-center border-r border-slate-100 last:border-r-0">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">99.4%</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">AI Eligibility Accuracy</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">Free</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Citizen Platform</div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive AI Preview Card */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Live AI Assistant Experience</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900">Try Asking SathiX OS</h2>
          </div>

          {/* Interactive Mock Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm">
            
            {/* Prompt Selector Pills */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {previewQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePreviewQuery(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    activePreviewQuery === idx
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {item.q}
                </button>
              ))}
            </div>

            {/* Answer Display */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">SathiX AI Voice & Text Engine</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-green-100 text-green-700 border border-green-200">
                  {previewQueries[activePreviewQuery].badge}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {previewQueries[activePreviewQuery].a}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                  <Volume2 className="w-4 h-4 text-slate-400 cursor-pointer hover:text-blue-600" />
                  <span>Listen in Hindi / Local Dialect</span>
                </div>
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
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
      <section className="py-20 bg-slate-50 border-t border-slate-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Built For Every Indian Citizen
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 font-medium">
            Removing bureaucracy and digital barriers through human-centric technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">3 Easy Steps</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How SathiX OS Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Speak or Type</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tell the assistant your age, occupation, or what assistance you need in any Indian language.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Eligibility Scan</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                SathiX OS scans over 500+ Central and State databases to find matching subsidies, health insurance, or loans.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">1-Click Guided Application</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Receive auto-filled document checklists, local CSC location guidance, and real-time status updates on your phone.
              </p>
            </div>
          </div>

          {/* Bottom Banner CTA */}
          <div className="mt-16 rounded-3xl bg-blue-50 border border-blue-100 p-8 text-center sm:flex items-center justify-between gap-6">
            <div className="text-left mb-4 sm:mb-0">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900">Ready to check your government benefits?</h3>
              <p className="text-xs sm:text-sm text-blue-700 mt-1 font-medium">No registration needed for quick scheme eligibility lookup.</p>
            </div>
            <button
              onClick={() => setActiveTab('assistant')}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
            >
              Open AI Assistant Now
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
