import React from 'react';
import { ActiveTab } from '../types';
import { 
  ShieldCheck, 
  Search, 
  Mic, 
  FileText, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';

interface InformationHomeProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const InformationHome: React.FC<InformationHomeProps> = ({ setActiveTab }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 flex flex-col py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-24">
        
        {/* The Problem & Solution Section */}
        <section className="text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The SathiX Paradigm Shift</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            From Complex Portals <br/> 
            <span className="text-slate-500">to a </span>
            <span className="text-blue-600">Personal Citizen Companion</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12 text-left">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span> Traditional Portals
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 font-medium">
                <li>• Fragmented across 500+ different websites</li>
                <li>• Complex bureaucratic language</li>
                <li>• Difficult eligibility rules & manual checking</li>
                <li>• English-first, alienating rural citizens</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 space-y-4 shadow-sm relative overflow-hidden">
              <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> SathiX OS
              </h3>
              <ul className="space-y-3 text-sm text-blue-800 relative z-10 font-medium">
                <li>• One unified conversational interface</li>
                <li>• AI translates rules into plain language</li>
                <li>• Instant, personalized eligibility matching</li>
                <li>• Voice-first across 12+ Indian languages</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works Visual Pipeline */}
        <section className="relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">How the OS Works</h2>
            <p className="text-slate-600 mt-2 font-medium">The architecture powering your digital assistant</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                <Mic className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Citizen Input</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium">Speak or type in local language.</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-slate-300 flex-shrink-0" />
            <div className="md:hidden w-1 h-8 bg-slate-200 rounded"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                <Bot className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">AI Engine</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium">Language translation & intent understanding.</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-slate-300 flex-shrink-0" />
            <div className="md:hidden w-1 h-8 bg-slate-200 rounded"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-500 mb-4 shadow-sm">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Gov Knowledge Graph</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium">Matches profile against 500+ scheme rules.</p>
            </div>

            <ArrowRight className="hidden md:block w-6 h-6 text-slate-300 flex-shrink-0" />
            <div className="md:hidden w-1 h-8 bg-slate-200 rounded"></div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-purple-500 mb-4 shadow-sm">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Action Roadmap</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium">Provides step-by-step application guidance.</p>
            </div>

          </div>
        </section>

        {/* Capabilities Showcase */}
        <section>
          <h2 className="text-2xl sm:text-4xl font-black text-center mb-12 text-slate-900">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white border border-slate-200 hover:border-blue-300 p-6 rounded-3xl transition group shadow-sm">
              <ShieldCheck className="w-8 h-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2 text-slate-900">Document Intelligence</h4>
              <p className="text-sm text-slate-600 font-medium">Upload Aadhaar or Ration Card. Our AI automatically extracts details and flags missing or expired documents before you apply.</p>
            </div>
            <div className="bg-white border border-slate-200 hover:border-blue-300 p-6 rounded-3xl transition group shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2 text-slate-900">Eligibility Engine</h4>
              <p className="text-sm text-slate-600 font-medium">Uses a dynamic rule engine to cross-reference your age, income, and occupation against live government criteria instantly.</p>
            </div>
            <div className="bg-white border border-slate-200 hover:border-blue-300 p-6 rounded-3xl transition group shadow-sm">
              <FileText className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold mb-2 text-slate-900">Multilingual RAG</h4>
              <p className="text-sm text-slate-600 font-medium">Fetches accurate policy documents using Retrieval-Augmented Generation, delivering answers in 12+ regional languages.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-12">
          <button 
            onClick={() => setActiveTab('assistant')}
            className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold hover:scale-105 transition shadow-sm flex items-center justify-center gap-2 mx-auto"
          >
            <Bot className="w-5 h-5" /> Experience SathiX AI
          </button>
        </section>

      </div>
    </div>
  );
};
