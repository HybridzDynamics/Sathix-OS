import React, { useState } from 'react';
import { 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Sparkles, 
  FileCheck, 
  Building2, 
  ExternalLink, 
  Bookmark, 
  ArrowRight,
  ShieldCheck,
  Check,
  Share2,
  MessageSquareText,
  Clock,
  Layers,
  HelpCircle,
  Landmark,
  BadgeCheck,
  FileText
} from 'lucide-react';
import { Scheme, Language, UserProfile } from '../types';
import { SchemeIcon } from './SchemeIcon';
import { translations } from '../utils/translations';
import { calculateSchemeMatch, getDocumentStatusForUser } from '../utils/schemeMatcher';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  user: UserProfile;
  isSaved?: boolean;
  onToggleSave?: (schemeId: string) => void;
  onSubmitApplication: (scheme: Scheme) => void;
  onAskSarthix?: (scheme: Scheme) => void;
  onShowToast?: (message: string) => void;
  onNavigateToApplications?: () => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  isOpen,
  onClose,
  language,
  user,
  isSaved = false,
  onToggleSave,
  onSubmitApplication,
  onAskSarthix,
  onShowToast,
  onNavigateToApplications,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState<string>('');
  const t = translations[language] || translations.en;

  if (!isOpen || !scheme) return null;

  const isHindi = language === 'hi';
  const title = isHindi && scheme.titleHindi ? scheme.titleHindi : scheme.title;
  const subtitle = isHindi && scheme.subtitleHindi ? scheme.subtitleHindi : scheme.subtitle;
  const description = isHindi && scheme.descriptionHindi ? scheme.descriptionHindi : scheme.description;
  const benefit = isHindi && scheme.benefitAmountHindi ? scheme.benefitAmountHindi : scheme.benefitAmount;
  const eligibilityList = isHindi && scheme.eligibilityHindi ? scheme.eligibilityHindi : scheme.eligibility;
  const documentsList = isHindi && scheme.documentsRequiredHindi ? scheme.documentsRequiredHindi : scheme.documentsRequired;

  // Compute dynamic match percentage & AI match reasoning
  const matchResult = calculateSchemeMatch(scheme, user);
  const displayPercentage = matchResult.percentage;
  const matchReasonText = isHindi ? matchResult.reasonHindi : matchResult.reason;

  const handleApplyClick = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setAppliedSuccess(true);
      const refNo = `SAR-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedRef(refNo);
      onSubmitApplication(scheme);
    }, 1100);
  };

  const handleShareClick = () => {
    const shareText = `${scheme.title} - ${benefit}. Check your eligibility on SarthixOS: ${scheme.officialPortalUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
    if (onShowToast) {
      onShowToast(isHindi ? 'योजना का लिंक कॉपी कर लिया गया है' : 'Scheme link copied to clipboard!');
    }
  };

  const handleAskSarthixClick = () => {
    if (onAskSarthix) {
      onAskSarthix(scheme);
    }
  };

  const applicationSteps = [
    {
      step: 1,
      title: isHindi ? 'स्वचालित e-KYC एवं पात्रता सत्यापन' : 'Automated e-KYC & Profile Matching',
      desc: isHindi ? 'आधार और भू-अभिलेखों से त्वरित सत्यापन' : 'Instant pre-fill via Aadhaar & Land records',
    },
    {
      step: 2,
      title: isHindi ? 'ऑनलाइन आवेदन व डिजिटल हस्ताक्षर' : 'Digital Application & Document Attachment',
      desc: isHindi ? 'सीधे राज्य नोडल विभाग को अग्रसारित' : 'Secure submission directly to nodal department',
    },
    {
      step: 3,
      title: isHindi ? 'स्वीकृति व प्रत्यक्ष डीबीटी लाभ' : 'Sanction & Direct Benefit Transfer (DBT)',
      desc: isHindi ? 'बैंक खाते में सीधे धनराशि का अंतरण' : 'Direct bank credit to seeded Jan Dhan account',
    },
  ];

  return (
    <div 
      id="scheme-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div 
        id="scheme-detail-modal-card"
        className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[94vh] overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header with Back button, Bookmark, Share and Close */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <button
              id="detail-modal-back-btn"
              onClick={onClose}
              className="p-2 -ml-1 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-200/60 transition-colors focus:outline-none"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                {scheme.categoryLabel}
              </span>
              <span className="text-sm font-bold text-[#1A237E] block truncate max-w-[220px] sm:max-w-md">
                {title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Share button */}
            <button
              id="detail-modal-share-btn"
              onClick={handleShareClick}
              className="p-2 text-slate-500 hover:text-[#1A237E] rounded-full hover:bg-slate-200/60 transition-colors"
              title="Share Scheme"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Bookmark button */}
            {onToggleSave && (
              <button
                id="detail-modal-save-btn"
                onClick={() => onToggleSave(scheme.id)}
                className={`p-2 rounded-full transition-colors ${
                  isSaved ? 'text-[#2196F3] bg-[#E3F2FD]' : 'text-slate-500 hover:text-[#1A237E] hover:bg-slate-200/60'
                }`}
                title={isSaved ? 'Remove from Saved' : 'Save Scheme'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Close button */}
            <button
              id="detail-modal-close-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors ml-1"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Main Title & Match Score Header Banner */}
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${scheme.iconBgColor || 'bg-[#E3F2FD]'} ${scheme.iconColor || 'text-[#2196F3]'} flex items-center justify-center shadow-xs shrink-0 mt-1`}>
              <SchemeIcon iconType={scheme.iconType} className="w-7 h-7" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A237E] text-white text-xs font-bold shadow-2xs mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" />
                <span>{displayPercentage}% Dynamic Match for {user.name.split(' ')[0]}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A237E] leading-tight">
                {title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {scheme.ministry}
              </p>
            </div>
          </div>

          {/* Key Direct Benefit Banner */}
          <div className="bg-gradient-to-r from-[#E3F2FD] to-[#F0F7FF] p-4 sm:p-5 rounded-2xl border border-[#BBDEFB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <span className="text-[11px] font-bold text-[#1565C0] uppercase tracking-wider block">
                {t.directBenefits}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#1A237E] mt-0.5 block">
                {benefit}
              </span>
            </div>
            <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-blue-100">
              <span className="text-[11px] text-slate-500 block">Disbursal Mode</span>
              <span className="text-xs font-bold text-[#1A237E] block flex items-center gap-1 sm:justify-end">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF50]" />
                <span>Direct DBT to Bank</span>
              </span>
            </div>
          </div>

          {/* AI Match Reason */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-[#FFC107]/50 flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-[#FFA000] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-950 block">
                {isHindi ? 'सारथी एआई पात्रता विश्लेषण' : 'Why Sarthix AI matched this scheme for you'}
              </span>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                {matchReasonText}
              </p>
            </div>
          </div>

          {/* About Scheme Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {isHindi ? 'योजना के बारे में' : 'About the Scheme'}
            </h4>
            <p className="text-slate-700 leading-relaxed text-sm font-normal bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              {description}
            </p>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              {t.eligibilityCheck}
            </h4>
            <div className="space-y-2">
              {eligibilityList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents with Profile Document Status Badges */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.documentsRequired}
              </h4>
              <span className="text-[11px] font-semibold text-[#2196F3] flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-[#4CAF50]" />
                <span>e-KYC Ready</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {documentsList.map((doc, idx) => {
                const docStatus = getDocumentStatusForUser(doc, user);
                const isVerified = docStatus.status === 'verified';

                return (
                  <div 
                    key={idx} 
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {doc}
                      </span>
                    </div>

                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      {isHindi ? docStatus.badgeTextHindi : docStatus.badgeText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Application Process */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              {isHindi ? 'आवेदन प्रक्रिया' : 'Application Roadmap & Next Steps'}
            </h4>
            <div className="space-y-2">
              {applicationSteps.map((stepItem) => (
                <div 
                  key={stepItem.step}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1A237E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {stepItem.step}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#1A237E]">
                      {stepItem.title}
                    </h5>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      {stepItem.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Government Portal Link */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Official Government Portal:</span>
            </div>
            <a 
              href={scheme.officialPortalUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#2196F3] hover:underline flex items-center gap-1 font-bold"
            >
              <span>{scheme.officialPortalUrl.replace('https://', '')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Sticky Footer Actions: Ask Sarthix + Apply Now */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2.5 sm:gap-3">
          {/* Ask Sarthix Button */}
          <button
            id="detail-modal-ask-sarthix-btn"
            type="button"
            onClick={handleAskSarthixClick}
            className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-[#2196F3]/40 bg-[#E3F2FD]/70 hover:bg-[#E3F2FD] text-[#1565C0] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
            title="Ask Sarthix AI about this scheme"
          >
            <Sparkles className="w-4 h-4 text-[#2196F3]" />
            <span className="hidden sm:inline">Ask Sarthix</span>
            <span className="sm:hidden">Ask AI</span>
          </button>

          {/* Apply Now / Submitted State */}
          {appliedSuccess ? (
            <div className="flex-1 py-2.5 px-3 sm:px-4 bg-emerald-50 border border-emerald-300 text-[#2E7D32] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 truncate">
                <Check className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <span className="truncate">Submitted! Ref: {generatedRef}</span>
              </div>
              {onNavigateToApplications && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToApplications();
                  }}
                  className="px-2.5 py-1 bg-[#4CAF50] text-white rounded-lg text-xs font-bold hover:bg-[#388E3C] transition-colors shrink-0 shadow-2xs"
                >
                  Track Status
                </button>
              )}
            </div>
          ) : (
            <button
              id="detail-modal-apply-btn"
              type="button"
              onClick={handleApplyClick}
              disabled={isApplying}
              className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-[#2196F3] hover:bg-[#1E88E5] active:bg-[#1976D2] text-white font-bold text-xs sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:ring-offset-2"
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying eKYC & Applying...</span>
                </>
              ) : (
                <>
                  <span>{t.applyForScheme}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
