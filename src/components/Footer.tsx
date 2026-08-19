import React from 'react';
import { PhoneCall, FileText } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-black text-slate-900 tracking-wide">SathiX OS</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
            SathiX OS is an AI-powered Digital Citizen Assistant designed to simplify government scheme discovery and access for Indian Citizens.
          </p>
        </div>

        {/* Col 2: Official Helplines */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            Helplines
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span><strong>PM-Kisan:</strong> 155261</span>
            </li>
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span><strong>Ayushman PM-JAY:</strong> 14555</span>
            </li>
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span><strong>National Scholarship:</strong> 0120-6619540</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Navigation */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-3 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            Links
          </h4>
          <div className="flex flex-col space-y-2">
            <button onClick={() => setActiveTab('about')} className="text-left hover:underline hover:text-blue-600 cursor-pointer">About Us</button>
            <button onClick={() => setActiveTab('legal')} className="text-left hover:underline hover:text-blue-600 cursor-pointer">Privacy & Legal</button>
            <button onClick={() => setActiveTab('accessibility')} className="text-left hover:underline hover:text-blue-600 cursor-pointer">Accessibility</button>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-slate-200 text-center text-slate-400 text-[10px]">
        © 2026 SathiX OS (Digital Citizen Assistant). Frontend Prototype.
      </div>
    </footer>
  );
};
