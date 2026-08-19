import React from 'react';
import { ActiveTab } from '../types';
import { Globe, Users } from 'lucide-react';

interface AboutPageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 flex flex-col py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 inline-block">
            One AI. Every Government Service. Every Indian Citizen.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            SathiX OS is an open-source initiative designed to bridge the digital divide between the Government of India and its citizens.
          </p>
        </div>

        {/* Why We Built It */}
        <section className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Why We Built SathiX OS</h2>
          </div>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed font-medium">
            <p>
              Millions of citizens miss out on crucial welfare schemes simply because they don't know they exist, or they cannot navigate the complex web of bureaucratic portals. Language barriers, low digital literacy, and confusing eligibility criteria act as massive walls.
            </p>
            <p>
              We envisioned a single, intelligent interface. Instead of citizens learning how to use government portals, the government portal should understand the citizen. By wrapping complex policies in an empathetic, multilingual AI layer, SathiX democratizes access to public services.
            </p>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-slate-900">The SathiX Difference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-red-600 font-bold mb-3">Traditional Portals</h3>
              <ul className="space-y-2 text-sm text-slate-600 font-medium">
                <li>Search through menus</li>
                <li>Read long policy PDFs</li>
                <li>Guess your eligibility</li>
                <li>Find application links yourself</li>
                <li>Mostly English/Hindi only</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm">
              <h3 className="text-blue-700 font-bold mb-3">SathiX OS</h3>
              <ul className="space-y-2 text-sm text-blue-800 font-medium">
                <li>Talk naturally to an AI</li>
                <li>AI summarizes policies instantly</li>
                <li>AI calculates precise eligibility</li>
                <li>Step-by-step personalized roadmap</li>
                <li>12+ Local Indian languages & Voice</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Future Vision */}
        <section className="text-center space-y-6 pt-8 border-t border-slate-200">
          <Globe className="w-12 h-12 text-blue-500 mx-auto opacity-80" />
          <h2 className="text-2xl font-bold text-slate-900">The Future Vision</h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            SathiX OS is not just a chatbot. It is a foundational Citizen Operating System. Our vision is to integrate this AI deeply into CSCs (Common Service Centres), WhatsApp, and local Panchayat systems, making it universally accessible even on low-end 2G feature phones via IVR.
          </p>
        </section>

      </div>
    </div>
  );
};
