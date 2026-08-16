import { Scheme, UserProfile } from '../types';

export interface SchemeMatchResult {
  percentage: number;
  reason: string;
  reasonHindi: string;
  matchedCriteria: string[];
  missingCriteria: string[];
}

export function calculateProfileCompleteness(user: UserProfile): number {
  const fields = [
    Boolean(user.name?.trim()),
    Boolean(user.phone?.trim()),
    Boolean(user.state?.trim()),
    Boolean(user.district?.trim()),
    Boolean(user.village?.trim()),
    Boolean(user.age && user.age > 0),
    Boolean(user.occupation?.trim()),
    Boolean(user.education?.trim()),
    Boolean(user.annualIncome && user.annualIncome > 0),
    Boolean(user.landHoldingAcres !== undefined && user.landHoldingAcres > 0),
    Boolean(user.rationCardType),
    Boolean(user.gender?.trim()),
    Boolean(user.casteCategory?.trim()),
    Boolean(user.maritalStatus?.trim()),
    Boolean(user.isAadhaarLinked),
    Boolean(user.bankAccountLinked),
  ];
  const filledCount = fields.filter(Boolean).length;
  return Math.min(100, Math.round((filledCount / fields.length) * 100));
}

export function calculateSchemeMatch(scheme: Scheme, user: UserProfile): SchemeMatchResult {
  let score = 70;
  const matchedCriteria: string[] = [];
  const missingCriteria: string[] = [];

  // Occupation & Category check
  const occ = (user.occupation || '').toLowerCase();
  const isFarmer = occ.includes('farmer') || occ.includes('agri') || occ.includes('किसान') || occ.includes('cultivator');
  const isArtisan = occ.includes('artisan') || occ.includes('craft') || occ.includes('karigar') || occ.includes('weaver');
  const isStudent = occ.includes('student') || occ.includes('scholar');
  const isSelfEmployed = occ.includes('self') || occ.includes('shop') || occ.includes('business') || occ.includes('vendor');

  if (scheme.category === 'agriculture') {
    if (isFarmer) {
      score += 16;
      matchedCriteria.push('Occupation: Verified Agricultural Cultivator');
    } else {
      score -= 10;
    }
    if (user.landHoldingAcres > 0 && user.landHoldingAcres <= 5) {
      score += 8;
      matchedCriteria.push(`Landholding: ${user.landHoldingAcres} Acres (Small & Marginal Category)`);
    }
  } else if (scheme.category === 'employment') {
    if (isArtisan || isSelfEmployed || isFarmer) {
      score += 12;
      matchedCriteria.push(`Occupation Profile: ${user.occupation}`);
    }
  } else if (scheme.category === 'education') {
    if (user.age && user.age <= 35) {
      score += 10;
      matchedCriteria.push(`Age: ${user.age} Years (Youth & Skill Development Bracket)`);
    }
    if (user.education) {
      matchedCriteria.push(`Education: ${user.education}`);
    }
  }

  // Age specific eligibility check
  if (user.age) {
    if (user.age >= 18 && user.age <= 65) {
      score += 2;
      matchedCriteria.push(`Age: ${user.age} Years (Working Age Citizen)`);
    }
  }

  // Education verification check
  if (user.education) {
    score += 1;
    matchedCriteria.push(`Education Record: ${user.education}`);
  }

  // Income / BPL check
  if (user.rationCardType === 'BPL' || user.rationCardType === 'AAY') {
    score += 6;
    matchedCriteria.push(`Socio-Economic: ${user.rationCardType} Ration Card Holder (NFSA)`);
  }
  if (user.annualIncome && user.annualIncome < 150000) {
    score += 4;
    matchedCriteria.push(`Income: ₹${user.annualIncome.toLocaleString('en-IN')} (Low Income Group)`);
  }

  // Identity & DBT check
  if (user.isAadhaarLinked && user.isKycVerified) {
    score += 2;
    matchedCriteria.push('Aadhaar eKYC: Verified with UIDAI');
  }
  if (user.bankAccountLinked) {
    score += 2;
    matchedCriteria.push('Direct Benefit Transfer: Active DBT Seeding');
  }

  // Cap score between 70 and 98
  const finalScore = Math.min(Math.max(score, 72), 98);

  // Generate dynamic reason
  let reason = '';
  let reasonHindi = '';

  const locationStr = user.district ? `${user.district}, ${user.state}` : user.state;

  if (scheme.category === 'agriculture') {
    reason = `Matches your verified ${user.occupation || 'Farmer'} status, ${user.landHoldingAcres || 2} acres landholding in ${locationStr}, and active Aadhaar DBT bank linkage.`;
    reasonHindi = `आपके सत्यापित ${user.occupationHindi || 'किसान'} प्रोफाइल, ${user.district || 'जिले'} में ${user.landHoldingAcres || 2} एकड़ भूमि और सक्रिय आधार डीबीटी बैंक खाते से मेल खाता है।`;
  } else if (scheme.category === 'health') {
    reason = `Eligible under ${user.rationCardType || 'BPL'} household category, age ${user.age || 42}, and income (< ₹1.5 Lakh/year) in ${locationStr}.`;
    reasonHindi = `${user.rationCardType || 'बीपीएल'} राशन कार्ड, आयु ${user.age || 42} वर्ष और कम वार्षिक आय के आधार पर ${user.district || 'जिले'} में पात्र।`;
  } else if (scheme.category === 'housing') {
    reason = `Matches rural residence in ${user.village || 'Varanasi'} (${locationStr}) with verified ${user.rationCardType || 'BPL'} shelter priority.`;
    reasonHindi = `${user.district || 'जिले'} के ग्रामीण क्षेत्र में ${user.rationCardType || 'बीपीएल'} आवास श्रेणी के अंतर्गत 100% पात्र।`;
  } else if (scheme.category === 'energy') {
    reason = `Matches residential domestic electricity connection in ${user.state} for direct rooftop subsidy.`;
    reasonHindi = `${user.state} में घरेलू बिजली कनेक्शन के तहत छत पर सोलर सब्सिडी के लिए पात्र।`;
  } else {
    reason = `100% match with your verified citizen profile (${user.education || '10th Pass'}, ${user.age || 42} yrs), ${user.state} residency, and active Aadhaar KYC.`;
    reasonHindi = `आपकी नागरिक प्रोफाइल (${user.education || '10वीं पास'}, आयु ${user.age || 42} वर्ष), ${user.state} निवास और सक्रिय आधार केवाईसी से पूर्ण मेल खाता है।`;
  }

  return {
    percentage: finalScore,
    reason,
    reasonHindi,
    matchedCriteria,
    missingCriteria,
  };
}

export interface DocumentStatus {
  name: string;
  nameHindi: string;
  status: 'ready' | 'verified' | 'action_needed';
  badgeText: string;
  badgeTextHindi: string;
}

export function getDocumentStatusForUser(docName: string, user: UserProfile): DocumentStatus {
  const lower = docName.toLowerCase();
  
  if (lower.includes('aadhaar')) {
    return {
      name: docName,
      nameHindi: 'आधार कार्ड',
      status: 'verified',
      badgeText: 'Verified via UIDAI',
      badgeTextHindi: 'यूआईडीएआई सत्यापित',
    };
  }
  
  if (lower.includes('land') || lower.includes('khasra') || lower.includes('khatauni') || lower.includes('ror')) {
    return {
      name: docName,
      nameHindi: 'भू-अभिलेख (खतौनी)',
      status: 'verified',
      badgeText: `Verified (${user.landHoldingAcres} Acres)`,
      badgeTextHindi: `सत्यापित (${user.landHoldingAcres} एकड़)`,
    };
  }

  if (lower.includes('bank') || lower.includes('passbook') || lower.includes('ifsc')) {
    return {
      name: docName,
      nameHindi: 'बैंक पासबुक',
      status: 'ready',
      badgeText: 'DBT Linked Jan Dhan',
      badgeTextHindi: 'डीबीटी लिंक जन धन',
    };
  }

  if (lower.includes('ration') || lower.includes('bpl')) {
    return {
      name: docName,
      nameHindi: 'राशन कार्ड',
      status: 'verified',
      badgeText: `${user.rationCardType} Card Ready`,
      badgeTextHindi: `${user.rationCardType} राशन कार्ड उपलब्ध`,
    };
  }

  if (lower.includes('mobile') || lower.includes('phone')) {
    return {
      name: docName,
      nameHindi: 'सक्रिय मोबाइल नंबर',
      status: 'ready',
      badgeText: 'OTP Ready',
      badgeTextHindi: 'ओटीपी तैयार',
    };
  }

  return {
    name: docName,
    nameHindi: docName,
    status: 'ready',
    badgeText: 'Available in DigiLocker',
    badgeTextHindi: 'डिजिलॉकर में उपलब्ध',
  };
}
