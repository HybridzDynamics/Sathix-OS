import React, { useState } from 'react';
import { Scheme, ActiveTab } from '../types';
import { MOCK_SCHEMES } from '../data/mockData';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  X, 
  Building2, 
  Award,
} from 'lucide-react';

interface SchemeExplorerProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const SchemeExplorer: React.FC<SchemeExplorerProps> = ({ setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [showEligibilityQuiz, setShowEligibilityQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [appliedSchemeId, setAppliedSchemeId] = useState<string | null>(null);

  const categories = [
    'All',
    'Agriculture',
    'Education',
    'Healthcare',
    'Social Welfare',
    'Women Empowerment',
    'Housing',
    'MSME & Business'
  ];

  // Filter logic
  const filteredSchemes = MOCK_SCHEMES.filter((sch) => {
    const matchesCategory = selectedCategory === 'All' || sch.category === selectedCategory;
    const matchesSearch = 
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Title & Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
                CENTRAL & STATE DIRECTORY
              </span>
              <span className="text-xs text-slate-500 font-mono">500+ Verified Schemes</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mt-1">Government Scheme Explorer</h1>
            <p className="text-sm text-slate-600 mt-1">
              Search by benefit, eligibility, category, or take the 1-minute AI eligibility quiz.
            </p>
          </div>

          <button
            onClick={() => setShowEligibilityQuiz(true)}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Take AI Eligibility Quiz</span>
          </button>
        </div>

        {/* Search Bar & Category Filter Chips */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name, e.g. 'Farmer 6000', 'Ayushman', 'Scholarship', 'Business Loan'..."
              className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-xl pl-12 pr-4 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((sch) => (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {sch.category}
                  </span>
                  {sch.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                      High Demand
                    </span>
                  )}
                </div>

                {/* Title & Department */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                  {sch.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sch.department}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed font-medium">
                  {sch.description}
                </p>

                {/* Benefit Amount Callout */}
                <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                  <span className="text-[11px] text-blue-800 font-medium">Financial Benefit:</span>
                  <span className="text-xs font-mono font-bold text-emerald-600">{sch.benefitAmount}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedScheme(sch)}
                  className="w-full py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-xs font-bold text-slate-700 transition"
                >
                  View Details & Rules
                </button>
                <button
                  onClick={() => {
                    setAppliedSchemeId(sch.id);
                    setTimeout(() => setAppliedSchemeId(null), 3000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition whitespace-nowrap shadow-sm"
                >
                  {appliedSchemeId === sch.id ? 'Applied! ✓' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Full Scheme Details View */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedScheme(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
                  {selectedScheme.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{selectedScheme.title}</h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">{selectedScheme.department}</p>
              </div>

              {/* Benefit Highlight */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-800 font-medium">Total Benefit Value</div>
                  <div className="text-lg font-mono font-bold text-emerald-600">{selectedScheme.benefitAmount}</div>
                </div>
                <Award className="w-8 h-8 text-emerald-500" />
              </div>

              {/* Eligibility Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Eligibility Criteria
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {selectedScheme.eligibility.map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents Required Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" /> Required Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedScheme.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium flex items-center space-x-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Steps */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Step-by-Step Application Process
                </h4>
                <ol className="space-y-2 text-xs text-slate-700 font-medium">
                  {selectedScheme.applySteps.map((step, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedScheme(null);
                    setActiveTab('assistant');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700"
                >
                  Ask AI Assistant to Apply
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal: Interactive Eligibility Quiz */}
        {showEligibilityQuiz && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl relative">
              <button 
                onClick={() => setShowEligibilityQuiz(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">SathiX AI 30-Second Eligibility Quiz</h3>
              </div>

              {quizStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 font-medium">Question 1: What is your primary occupation category?</p>
                  <div className="space-y-2">
                    {['Farmer / Agriculture', 'Small Business Owner / Artisan', 'Student / Youth', 'Unemployed / Senior Citizen'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setQuizStep(2)}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-xs text-slate-700 font-medium transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 font-medium">Question 2: What is your annual family income range?</p>
                  <div className="space-y-2">
                    {['Below ₹ 1.5 Lakhs', '₹ 1.5 Lakhs to ₹ 2.5 Lakhs', '₹ 2.5 Lakhs to ₹ 5.0 Lakhs', 'Above ₹ 5.0 Lakhs'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setQuizStep(3)}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-xs text-slate-700 font-medium transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 3 && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Match Complete!</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    You are eligible for <strong>PM-KISAN (₹6,000)</strong>, <strong>Ayushman Bharat (₹5 Lakh)</strong>, and <strong>PM MUDRA Loan</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setShowEligibilityQuiz(false);
                      setQuizStep(1);
                      setActiveTab('assistant');
                    }}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm"
                  >
                    Open AI Assistant to Apply
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
