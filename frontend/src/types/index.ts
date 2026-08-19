export type JourneyState = 'idle' | 'listening' | 'thinking' | 'interview' | 'roadmap' | 'offline';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  suggestedSchemes?: Scheme[];
  actionPrompts?: string[];
  documentAnalysisResult?: any;
}

export interface Scheme {
  id: string;
  title: string;
  titleHindi?: string;
  department: string;
  tags: string[];
  category: string;
  featured?: boolean;
  description: string;
  benefitAmount: string;
  eligibility: string[];
  requiredDocuments: string[];
  applySteps: string[];
  applicationDeadline?: string;
  officialUrl?: string;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  actionLabel?: string;
}

export type ActiveTab = 'landing' | 'info' | 'about' | 'assistant' | 'schemes' | 'dashboard' | 'status' | 'accessibility' | 'legal' | 'admin';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  dyslexicFont: boolean;
  voiceSpeed: number;
}

export interface CitizenProfile {
  name: string;
  aadhaarNumber: string;
  gender: string;
  age: number;
  occupation: string;
  annualIncome: string;
  category: string;
  state: string;
  district: string;
  isRural: boolean;
  verifiedStatus: boolean;
  phone: string;
  email: string;
}

export interface ApplicationStatus {
  id: string;
  schemeId: string;
  schemeTitle: string;
  category: string;
  appliedDate: string;
  currentStep: number;
  totalSteps: number;
  statusText: string;
  statusColor: string;
  referenceNumber: string;
  benefitAmount: string;
  timeline: {
    title: string;
    date: string;
    completed: boolean;
    description?: string;
    active?: boolean;
  }[];
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
  size: string;
  iconName: string;
}
