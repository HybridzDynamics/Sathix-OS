export type NavTab = 'home' | 'history' | 'explore' | 'applications' | 'saved' | 'profile' | 'accessibility';

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

export type TextSize = 'S' | 'M' | 'L' | 'XL';

export interface AccessibilitySettings {
  textSize: TextSize;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderFriendly: boolean;
  voiceInteraction: boolean;
  simplifiedLanguage: boolean;
}

export interface Scheme {
  id: string;
  title: string;
  titleHindi: string;
  subtitle: string;
  subtitleHindi: string;
  description: string;
  descriptionHindi: string;
  category: 'agriculture' | 'health' | 'housing' | 'banking' | 'women' | 'energy' | 'employment' | 'education';
  categoryLabel: string;
  matchPercentage: number;
  matchReason: string;
  iconType: 'tractor' | 'shield-plus' | 'home' | 'bank' | 'flame' | 'sun' | 'sprout' | 'user-check' | 'heart-handshake' | 'wallet';
  iconBgColor?: string;
  iconColor?: string;
  benefitAmount: string;
  benefitAmountHindi: string;
  eligibility: string[];
  eligibilityHindi: string[];
  documentsRequired: string[];
  documentsRequiredHindi: string[];
  ministry: string;
  officialPortalUrl: string;
  isPopular?: boolean;
}

export interface Application {
  id: string;
  schemeId: string;
  schemeTitle: string;
  schemeTitleHindi: string;
  referenceNumber: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  currentStep: number;
  totalSteps: number;
  statusDescription: string;
  statusDescriptionHindi: string;
  timeline: {
    title: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export interface UserProfile {
  name: string;
  nameHindi: string;
  phone: string;
  avatarUrl: string;
  state: string;
  district: string;
  village: string;
  age: number;
  occupation: string;
  occupationHindi: string;
  education: string;
  educationHindi: string;
  annualIncome: number;
  landHoldingAcres: number;
  rationCardType: 'BPL' | 'AAY' | 'APL';
  gender?: string;
  casteCategory?: string;
  maritalStatus?: string;
  isAadhaarLinked: boolean;
  isKycVerified: boolean;
  bankAccountLinked: boolean;
  preferredLanguage: Language;
}

export interface ChatDocumentItem {
  icon: 'id-card' | 'file-text' | 'building' | 'receipt' | 'camera';
  name: string;
  nameHindi?: string;
  description?: string;
}

export interface ChatAttachment {
  name: string;
  size: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  textHindi?: string;
  recommendedSchemeIds?: string[];
  documentsList?: ChatDocumentItem[];
  applicationStatusData?: {
    schemeTitle: string;
    refNo: string;
    status: 'pending' | 'approved';
    stepText: string;
  }[];
  attachment?: ChatAttachment;
}

export interface ChatSession {
  id: string;
  title: string;
  titleHindi?: string;
  updatedAt: string;
  preview: string;
  messages: ChatMessage[];
  pinned?: boolean;
  category?: string;
}

