import React from 'react';
import { Sparkles, ShieldCheck, PhoneCall, HelpCircle, FileText, Globe } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#050810] border-t border-cyan-500/20 text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-white tracking-wide">SathiX OS</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            SathiX OS is an AI-powered Digital Citizen Assistant designed to simplify government scheme discovery, eligibility computation, and DBT service access for 1.4 Billion Indian Citizens.
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>SIH 2026 Innovation Showcase Prototype</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
            Platform Modules
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('assistant')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>🤖</span> AI Citizen Assistant
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('schemes')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>🔍</span> Scheme Explorer & Eligibility
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>👤</span> Citizen Status Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('accessibility')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>♿</span> Multilingual Accessibility Center
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('admin')} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>📊</span> Government Analytics Mockup
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Official Helplines */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
            Citizen Support Helplines
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>PM-Kisan Helpline:</strong> 155261 / 1800-115-526</span>
            </li>
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <span><strong>Ayushman PM-JAY:</strong> 14555</span>
            </li>
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span><strong>National Scholarship:</strong> 0120-6619540</span>
            </li>
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
              <span><strong>PM MUDRA Helpline:</strong> 1800-180-1111</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Digital India Ecosystem */}
        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
            Government Tech Standard
          </h4>
          <p className="text-[11px] text-slate-400 mb-3">
            Designed in accordance with Digital India guidelines, GIGW 3.0 accessibility standards, and WCAG 2.1 AAA compliance.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-cyan-300">
              DigiLocker Ready
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-emerald-300">
              Aadhaar e-KYC
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-purple-300">
              UMANG Compatible
            </span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>
          © 2026 SathiX OS (Digital Citizen Assistant). Pure Frontend Demonstration Prototype.
        </div>
        <div className="flex items-center space-x-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Accessibility Statement</span>
        </div>
      </div>
    </footer>
  );
};
