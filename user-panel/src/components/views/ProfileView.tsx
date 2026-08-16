import React, { useState } from 'react';
import { UserProfile, Language } from '../../types';
import { 
  ArrowLeft, 
  Pencil, 
  Info, 
  FileText, 
  Languages, 
  Accessibility as AccessibilityIcon, 
  ChevronRight, 
  LogOut, 
  Check, 
  X, 
  Phone, 
  Sparkles,
  ShieldCheck,
  Building,
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { translations } from '../../utils/translations';
import { calculateProfileCompleteness } from '../../utils/schemeMatcher';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedFields: Partial<UserProfile>) => void;
  language: Language;
  onOpenLanguagePicker: () => void;
  onNavigateToAccessibility: () => void;
  onBack: () => void;
  onShowToast: (message: string) => void;
}

type BasicFieldType = 'location' | 'age' | 'occupation' | 'education';

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  language,
  onOpenLanguagePicker,
  onNavigateToAccessibility,
  onBack,
  onShowToast,
}) => {
  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  // Dynamic Profile Completeness %
  const completeness = calculateProfileCompleteness(user);

  // Field Edit Modal state
  const [activeEditingField, setActiveEditingField] = useState<BasicFieldType | null>(null);
  const [tempState, setTempState] = useState<string>(user.state || 'Uttar Pradesh');
  const [tempDistrict, setTempDistrict] = useState<string>(user.district || 'Varanasi');
  const [tempAge, setTempAge] = useState<number>(user.age || 42);
  const [tempOccupation, setTempOccupation] = useState<string>(user.occupation || 'Small-scale Farmer');
  const [tempEducation, setTempEducation] = useState<string>(user.education || '10th Pass');

  // Additional details modal state
  const [showAdditionalModal, setShowAdditionalModal] = useState<boolean>(false);
  const [tempLandholding, setTempLandholding] = useState<number>(user.landHoldingAcres || 2.4);
  const [tempIncome, setTempIncome] = useState<number>(user.annualIncome || 95000);
  const [tempRationCard, setTempRationCard] = useState<'BPL' | 'AAY' | 'APL'>(user.rationCardType || 'BPL');
  const [tempGender, setTempGender] = useState<string>(user.gender || 'Male');
  const [tempCaste, setTempCaste] = useState<string>(user.casteCategory || 'OBC');
  const [tempMarital, setTempMarital] = useState<string>(user.maritalStatus || 'Married');
  const [tempVillage, setTempVillage] = useState<string>(user.village || 'Shivpur');

  // Sign out confirmation dialog
  const [showSignOutConfirm, setShowSignOutConfirm] = useState<boolean>(false);

  // Common Indian States & Districts
  const statesList = [
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Bihar',
    'Maharashtra',
    'Rajasthan',
    'Tamil Nadu',
    'Karnataka',
    'West Bengal',
    'Gujarat',
    'Punjab',
    'Haryana',
  ];

  const occupationsList = [
    { en: 'Small-scale Farmer', hi: 'लघु किसान' },
    { en: 'Marginal Farmer', hi: 'सीमांत किसान' },
    { en: 'Agricultural Laborer', hi: 'कृषि मजदूर' },
    { en: 'Artisan / Craftsman', hi: 'दस्तकार / कारीगर' },
    { en: 'Self-employed / Shopkeeper', hi: 'स्व-रोजगार / दुकानदार' },
    { en: 'Daily Wage Laborer', hi: 'दिहाड़ी मजदूर' },
    { en: 'Student / Scholar', hi: 'छात्र / शोधार्थी' },
  ];

  const educationLevels = [
    { en: 'Primary (5th Pass)', hi: 'प्राथमिक (5वीं पास)' },
    { en: 'Middle (8th Pass)', hi: 'मध्यम (8वीं पास)' },
    { en: '10th Pass (Matriculation)', hi: '10वीं पास (मैट्रिक)' },
    { en: '12th Pass (Intermediate)', hi: '12वीं पास (इंटरमीडिएट)' },
    { en: 'Graduate / Diploma', hi: 'स्नातक / डिप्लोमा' },
    { en: 'Post Graduate', hi: 'स्नातकोत्तर' },
    { en: 'No Formal Schooling', hi: 'अनौपचारिक शिक्षा' },
  ];

  const openFieldEditor = (field: BasicFieldType) => {
    if (field === 'location') {
      setTempState(user.state || 'Uttar Pradesh');
      setTempDistrict(user.district || 'Varanasi');
    } else if (field === 'age') {
      setTempAge(user.age || 42);
    } else if (field === 'occupation') {
      setTempOccupation(user.occupation || 'Small-scale Farmer');
    } else if (field === 'education') {
      setTempEducation(user.education || '10th Pass');
    }
    setActiveEditingField(field);
  };

  const handleSaveBasicField = () => {
    if (activeEditingField === 'location') {
      onUpdateUser({ state: tempState, district: tempDistrict });
      onShowToast(isHindi ? 'स्थान अपडेट कर दिया गया' : 'Location updated successfully');
    } else if (activeEditingField === 'age') {
      onUpdateUser({ age: Number(tempAge) });
      onShowToast(isHindi ? 'आयु अपडेट कर दी गई' : 'Age updated successfully');
    } else if (activeEditingField === 'occupation') {
      const match = occupationsList.find(o => o.en === tempOccupation);
      onUpdateUser({ 
        occupation: tempOccupation,
        occupationHindi: match ? match.hi : tempOccupation 
      });
      onShowToast(isHindi ? 'व्यवसाय अपडेट कर दिया गया' : 'Occupation updated successfully');
    } else if (activeEditingField === 'education') {
      const match = educationLevels.find(e => e.en === tempEducation);
      onUpdateUser({ 
        education: tempEducation,
        educationHindi: match ? match.hi : tempEducation 
      });
      onShowToast(isHindi ? 'शिक्षा रिकॉर्ड अपडेट कर दिया गया' : 'Education updated successfully');
    }
    setActiveEditingField(null);
  };

  const handleSaveAdditionalDetails = () => {
    onUpdateUser({
      landHoldingAcres: Number(tempLandholding),
      annualIncome: Number(tempIncome),
      rationCardType: tempRationCard,
      gender: tempGender,
      casteCategory: tempCaste,
      maritalStatus: tempMarital,
      village: tempVillage,
    });
    setShowAdditionalModal(false);
    onShowToast(isHindi ? 'अतिरिक्त विवरण सहेजे गए व पात्रता पुनर्गणित' : 'Additional details saved & eligibility re-calculated');
  };

  const getLanguageLabel = (code: Language) => {
    switch (code) {
      case 'en':
        return 'English / Hindi';
      case 'hi':
        return 'हिंदी (Hindi) / English';
      case 'ta':
        return 'தமிழ் (Tamil)';
      case 'te':
        return 'తెలుగు (Telugu)';
      case 'bn':
        return 'বাংলা (Bengali)';
      case 'mr':
        return 'मराठी (Marathi)';
      default:
        return 'English / Hindi';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 pb-20 pt-2 px-3 sm:px-0 animate-in fade-in duration-200">
      {/* Top Bar with Back Arrow */}
      <div className="flex items-center gap-3">
        <button
          id="profile-back-btn"
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-slate-700 hover:bg-slate-200/70 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
          title="Back"
          aria-label="Back to previous screen"
        >
          <ArrowLeft className="w-6 h-6 text-[#1A237E]" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1A237E]">
          {isHindi ? 'मेरी प्रोफाइल' : 'My Profile'}
        </h1>
      </div>

      {/* Avatar & User Details */}
      <div className="flex flex-col items-center justify-center text-center pt-2">
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#4CAF50] border-2 border-white flex items-center justify-center shadow-xs">
            <Check className="w-3 h-3 text-white stroke-[3]" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-[#1A237E] mt-3">
          {isHindi ? user.nameHindi || user.name : user.name}
        </h2>

        <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1 font-medium">
          <Phone className="w-4 h-4 text-slate-400" />
          <span>{user.phone}</span>
        </div>
      </div>

      {/* Blue Information Callout Card */}
      <div 
        id="profile-info-banner"
        className="p-4 sm:p-5 rounded-3xl bg-[#E3F2FD]/80 border border-[#BBDEFB] flex items-start gap-3.5 shadow-2xs"
      >
        <div className="w-6 h-6 rounded-full bg-[#2196F3] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Info className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {isHindi 
            ? 'यह जानकारी हमें आपके पात्र सरकारी योजनाओं को खोजने में मदद करती है। इसे अद्यतन रखने से सटीक सिफारिशें सुनिश्चित होती हैं।' 
            : "This information helps us find schemes you're eligible for. Keeping it updated ensures accurate recommendations."}
        </p>
      </div>

      {/* ================= BASIC INFORMATION SECTION ================= */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          {isHindi ? 'बुनियादी जानकारी' : 'BASIC INFORMATION'}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_16px_rgba(26,35,126,0.04)] divide-y divide-slate-100 overflow-hidden">
          {/* Row 1: State / District */}
          <div 
            id="profile-row-location"
            onClick={() => openFieldEditor('location')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {isHindi ? 'राज्य / जिला' : 'State / District'}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {user.state} / {user.district}
              </div>
            </div>
            <button
              id="edit-btn-location"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFieldEditor('location');
              }}
              className="p-2 rounded-full text-slate-400 group-hover:text-[#2196F3] group-hover:bg-[#E3F2FD] transition-all"
              title="Edit Location"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Row 2: Age */}
          <div 
            id="profile-row-age"
            onClick={() => openFieldEditor('age')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {isHindi ? 'आयु' : 'Age'}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {user.age || 42} {isHindi ? 'वर्ष' : 'Years'}
              </div>
            </div>
            <button
              id="edit-btn-age"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFieldEditor('age');
              }}
              className="p-2 rounded-full text-slate-400 group-hover:text-[#2196F3] group-hover:bg-[#E3F2FD] transition-all"
              title="Edit Age"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Row 3: Occupation */}
          <div 
            id="profile-row-occupation"
            onClick={() => openFieldEditor('occupation')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {isHindi ? 'व्यवसाय' : 'Occupation'}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {isHindi ? user.occupationHindi || user.occupation : user.occupation}
              </div>
            </div>
            <button
              id="edit-btn-occupation"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFieldEditor('occupation');
              }}
              className="p-2 rounded-full text-slate-400 group-hover:text-[#2196F3] group-hover:bg-[#E3F2FD] transition-all"
              title="Edit Occupation"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Row 4: Education */}
          <div 
            id="profile-row-education"
            onClick={() => openFieldEditor('education')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {isHindi ? 'शिक्षा' : 'Education'}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                {isHindi ? user.educationHindi || user.education : user.education}
              </div>
            </div>
            <button
              id="edit-btn-education"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFieldEditor('education');
              }}
              className="p-2 rounded-full text-slate-400 group-hover:text-[#2196F3] group-hover:bg-[#E3F2FD] transition-all"
              title="Edit Education"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= ADDITIONAL DETAILS (OPTIONAL) ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isHindi ? 'अतिरिक्त विवरण' : 'ADDITIONAL DETAILS'}
          </span>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
            {isHindi ? 'वैकल्पिक' : 'OPTIONAL'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_16px_rgba(26,35,126,0.04)] space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1A237E]">
                  {isHindi ? 'प्रोफाइल पूर्ण करें' : 'Complete Profile'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'सटीक योजनाओं के लिए अधिक विवरण जोड़ें' : 'Add more details for better matches'}
                </p>
              </div>
            </div>

            {/* Dynamic Calculated Percentage */}
            <span 
              id="profile-completeness-percentage"
              className="text-xl sm:text-2xl font-black text-[#1A237E]"
            >
              {completeness}%
            </span>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1565C0] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completeness}%` }}
            />
          </div>

          {/* Add Details Button */}
          <button
            id="profile-add-details-btn"
            type="button"
            onClick={() => setShowAdditionalModal(true)}
            className="w-full py-3 px-4 rounded-2xl bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#1565C0] font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
          >
            {isHindi ? 'अतिरिक्त विवरण भरें / संपादित करें' : 'Add Details'}
          </button>
        </div>
      </div>

      {/* ================= PREFERENCES SECTION ================= */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          {isHindi ? 'प्राथमिकताएं' : 'PREFERENCES'}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_16px_rgba(26,35,126,0.04)] divide-y divide-slate-100 overflow-hidden">
          {/* Row 1: Language */}
          <div 
            id="profile-preference-language"
            onClick={onOpenLanguagePicker}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-[#E3F2FD] group-hover:text-[#2196F3] transition-colors">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {isHindi ? 'भाषा (Language)' : 'Language'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {getLanguageLabel(language)}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#2196F3] group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* Row 2: Accessibility Settings */}
          <div 
            id="profile-preference-accessibility"
            onClick={onNavigateToAccessibility}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-[#E3F2FD] group-hover:text-[#2196F3] transition-colors">
                <AccessibilityIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {isHindi ? 'सुगमता सेटिंग्स' : 'Accessibility Settings'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isHindi ? 'टेक्स्ट साइज, कंट्रास्ट, वॉयस विकल्प' : 'Text size, high contrast, voice options'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#2196F3] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* ================= SIGN OUT ACTION ================= */}
      <div className="pt-2 flex justify-center">
        <button
          id="profile-signout-btn"
          type="button"
          onClick={() => setShowSignOutConfirm(true)}
          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-sm sm:text-base py-3 px-6 rounded-2xl hover:bg-red-50 transition-colors focus:outline-none"
        >
          <LogOut className="w-5 h-5" />
          <span>{isHindi ? 'साइन आउट (Sign Out)' : 'Sign Out'}</span>
        </button>
      </div>

      {/* ================= INLINE EDIT MODAL FOR BASIC INFO ================= */}
      {activeEditingField && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1A237E]">
                {activeEditingField === 'location' && (isHindi ? 'स्थान संपादित करें' : 'Edit State & District')}
                {activeEditingField === 'age' && (isHindi ? 'आयु संपादित करें' : 'Edit Age')}
                {activeEditingField === 'occupation' && (isHindi ? 'व्यवसाय संपादित करें' : 'Edit Occupation')}
                {activeEditingField === 'education' && (isHindi ? 'शिक्षा रिकॉर्ड संपादित करें' : 'Edit Education Level')}
              </h3>
              <button
                onClick={() => setActiveEditingField(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Field Specific Inputs */}
            {activeEditingField === 'location' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State / राज्य</label>
                  <select
                    value={tempState}
                    onChange={(e) => setTempState(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
                  >
                    {statesList.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">District / जिला</label>
                  <input
                    type="text"
                    value={tempDistrict}
                    onChange={(e) => setTempDistrict(e.target.value)}
                    placeholder="e.g. Varanasi, Lucknow, Patna"
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
                  />
                </div>
              </div>
            )}

            {activeEditingField === 'age' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Age (in years) / आयु</label>
                <input
                  type="number"
                  min="16"
                  max="100"
                  value={tempAge}
                  onChange={(e) => setTempAge(Math.max(1, Number(e.target.value)))}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-white text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
                />
                <p className="text-[11px] text-slate-500">
                  Used for welfare age eligibility (e.g. youth training &lt;35 yrs, senior citizen pensions &gt;60 yrs).
                </p>
              </div>
            )}

            {activeEditingField === 'occupation' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Primary Occupation / मुख्य व्यवसाय</label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {occupationsList.map(occ => (
                    <button
                      key={occ.en}
                      type="button"
                      onClick={() => setTempOccupation(occ.en)}
                      className={`w-full p-3 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between border ${
                        tempOccupation === occ.en
                          ? 'bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/60'
                      }`}
                    >
                      <span>{isHindi ? occ.hi : occ.en}</span>
                      {tempOccupation === occ.en && <Check className="w-4 h-4 text-[#2196F3]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeEditingField === 'education' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Educational Qualification / शिक्षा स्तर</label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {educationLevels.map(edu => (
                    <button
                      key={edu.en}
                      type="button"
                      onClick={() => setTempEducation(edu.en)}
                      className={`w-full p-3 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between border ${
                        tempEducation === edu.en
                          ? 'bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/60'
                      }`}
                    >
                      <span>{isHindi ? edu.hi : edu.en}</span>
                      {tempEducation === edu.en && <Check className="w-4 h-4 text-[#2196F3]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save & Cancel Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveEditingField(null)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                id="save-basic-field-btn"
                onClick={handleSaveBasicField}
                className="flex-1 py-3 rounded-2xl bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                {isHindi ? 'सहेजें' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADDITIONAL DETAILS MODAL ================= */}
      {showAdditionalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200 max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A237E]">
                    {isHindi ? 'अतिरिक्त पात्रता विवरण' : 'Additional Eligibility Details'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHindi ? 'सटीक योजना मिलान के लिए आवश्यक' : 'Improves matching accuracy across 100+ schemes'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdditionalModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Landholding */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Landholding in Acres / कृषि भूमि (एकड़)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={tempLandholding}
                  onChange={(e) => setTempLandholding(Math.max(0, Number(e.target.value)))}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Small & Marginal Farmer limit is up to 5 Acres (2 Hectares) for PM-Kisan & subsidies.
                </p>
              </div>

              {/* Annual Family Income */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Annual Household Income / वार्षिक पारिवारिक आय (₹)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={tempIncome}
                  onChange={(e) => setTempIncome(Math.max(0, Number(e.target.value)))}
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
                />
              </div>

              {/* Ration Card Category */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ration Card Category / राशन कार्ड प्रकार
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BPL', 'AAY', 'APL'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTempRationCard(type)}
                      className={`p-2.5 rounded-xl font-bold text-xs border transition-all ${
                        tempRationCard === type
                          ? 'bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9]'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {type} {type === 'BPL' ? '(गरीबी रेखा)' : type === 'AAY' ? '(अंत्योदय)' : '(सामान्य)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender & Social Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender / लिंग</label>
                  <select
                    value={tempGender}
                    onChange={(e) => setTempGender(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
                  >
                    <option value="Male">Male / पुरुष</option>
                    <option value="Female">Female / महिला</option>
                    <option value="Other">Other / अन्य</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Social Category / सामाजिक श्रेणी</label>
                  <select
                    value={tempCaste}
                    onChange={(e) => setTempCaste(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
                  >
                    <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                    <option value="SC">SC (अनुसूचित जाति)</option>
                    <option value="ST">ST (अनुसूचित जनजाति)</option>
                    <option value="General">General / सामान्य</option>
                  </select>
                </div>
              </div>

              {/* Village / Gram Panchayat */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Village / Gram Panchayat / ग्राम पंचायत
                </label>
                <input
                  type="text"
                  value={tempVillage}
                  onChange={(e) => setTempVillage(e.target.value)}
                  placeholder="e.g. Shivpur"
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2196F3]/30"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowAdditionalModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-white transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                id="save-additional-details-btn"
                onClick={handleSaveAdditionalDetails}
                className="flex-1 py-3 rounded-2xl bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                {isHindi ? 'विवरण सहेजें' : 'Save Details'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SIGN OUT CONFIRMATION MODAL ================= */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isHindi ? 'क्या आप साइन आउट करना चाहते हैं?' : 'Are you sure you want to sign out?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isHindi ? 'आपकी स्थानीय प्राथमिकताएं और सहेजी गई योजनाएं सुरक्षित रहेंगी।' : 'Your local settings and saved schemes will remain accessible upon return.'}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                id="confirm-signout-btn"
                onClick={() => {
                  setShowSignOutConfirm(false);
                  onShowToast(isHindi ? 'सफलतापूर्वक साइन आउट किया गया' : 'Signed out successfully');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
              >
                {isHindi ? 'साइन आउट' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
