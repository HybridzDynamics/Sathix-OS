import { Scheme, ApplicationStatus, DocumentItem, CitizenProfile, LanguageOption } from '../types';

export const MOCK_CITIZEN: CitizenProfile = {
  name: 'Ramesh Kumar Verma',
  aadhaarNumber: 'XXXX-XXXX-8921',
  gender: 'Male',
  age: 42,
  occupation: 'Farmer & Small Agriculture Entrepreneur',
  annualIncome: '₹ 1,80,000 / year',
  category: 'OBC / Small Farmer',
  state: 'Uttar Pradesh',
  district: 'Varanasi',
  isRural: true,
  verifiedStatus: true,
  phone: '+91 98765 43210',
  email: 'ramesh.verma@digitalindia.in'
};

export const MOCK_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    titleHindi: 'प्रधानमंत्री किसान सम्मान निधि',
    category: 'Agriculture',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Direct income support of ₹6,000 per year transferred into bank accounts of land-holding farmer families in 3 equal installments.',
    benefitAmount: '₹ 6,000 / year',
    eligibility: [
      'Small and marginal farmer families with landholding up to 2 hectares',
      'Citizens of India with valid Aadhaar linked bank account',
      'Excludes high-income tax payers, institutional landholders'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding Ownership Documents (Khatauni / Khasra)',
      'Bank Account Passbook',
      'Active Mobile Number linked with Aadhaar'
    ],
    applicationDeadline: 'Continuous Scheme',
    featured: true,
    tags: ['Direct Transfer', 'Farmers', 'Agriculture', 'Central Scheme'],
    applySteps: [
      'Self-registration via PM-Kisan Portal or SathiX OS Assistant',
      'Aadhaar e-KYC Verification',
      'State Revenue Officer Land Verification',
      'Direct Benefit Transfer (DBT) credit to Bank Account'
    ],
    officialUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat - PM-JAY (Health Insurance)',
    titleHindi: 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना',
    category: 'Healthcare',
    department: 'National Health Authority (NHA)',
    description: 'Health cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization across impaneled public & private hospitals.',
    benefitAmount: '₹ 5,00,000 / year Health Cover',
    eligibility: [
      'Families identified under SECC 2011 data / Ration Card holders',
      'Senior citizens aged 70 years and above regardless of income',
      'Informal sector workers & rural households'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / Ayushman Card',
      'Proof of Identity & Address'
    ],
    applicationDeadline: 'Continuous Scheme',
    featured: true,
    tags: ['Cashless Treatment', 'Healthcare', 'Senior Citizens', 'Family Cover'],
    applySteps: [
      'Verify SECC Eligibility using SathiX OS',
      'e-KYC verification using Biometric/OTP',
      'Instant Generation of Golden Ayushman Card',
      'Cashless admission at any empanelled hospital'
    ],
    officialUrl: 'https://pmjay.gov.in'
  },
  {
    id: 'pm-awas-yojana',
    title: 'Pradhan Mantri Awas Yojana (PMAY-Gramin)',
    titleHindi: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
    category: 'Housing',
    department: 'Ministry of Rural Development',
    description: 'Financial assistance to homeless and households living in kutcha or dilapidated houses for constructing pucca houses with basic amenities.',
    benefitAmount: '₹ 1,20,000 - ₹ 1,30,000 Direct Subsidy',
    eligibility: [
      'Houseless families or living in zero/one/two room kutcha houses',
      'Annual family income below threshold for rural households',
      'Must not own a pucca house anywhere in India'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Job Card (MGNREGA)',
      'Bank Account details',
      'Consent form to use Aadhaar'
    ],
    applicationDeadline: 'Dec 31, 2026',
    featured: true,
    tags: ['Housing', 'Rural Development', 'Subsidy', 'Pucca House'],
    applySteps: [
      'Gram Sabha Selection list verification',
      'Geotagging of existing land/hut by Block Officer',
      'Direct Benefit Installment disbursal in 3 phases',
      'Final geo-verified completion certificate'
    ],
    officialUrl: 'https://pmayg.nic.in'
  },
  {
    id: 'national-scholarship',
    title: 'Post-Matric Scholarship Scheme for SC/ST/OBC Students',
    titleHindi: 'छात्रवृत्ति एवं शुल्क प्रतिपूर्ति योजना',
    category: 'Education',
    department: 'Ministry of Social Justice and Empowerment',
    description: 'Financial support to students pursuing post-secondary education to reduce dropout rates and support higher studies.',
    benefitAmount: 'Full Tuition Fee + Maintenance Allowance up to ₹25,000/yr',
    eligibility: [
      'Students belonging to SC / ST / OBC / EWS categories',
      'Family annual income less than ₹2.50 Lakh',
      'Enrolled in recognized College/University degree or diploma'
    ],
    requiredDocuments: [
      'Caste Certificate',
      'Income Certificate issued by Tehsildar',
      'Marksheet of previous qualifying exam',
      'College Fee Receipt & Student ID'
    ],
    applicationDeadline: 'Oct 30, 2026',
    featured: true,
    tags: ['Education', 'Scholarship', 'Students', 'DBT'],
    applySteps: [
      'Register on National Scholarship Portal (NSP)',
      'Upload Institute Verification Slip & Caste Certificate',
      'Institute & Nodal Officer Verification',
      'Scholarship Disbursal directly to Student Aadhaar Bank'
    ],
    officialUrl: 'https://scholarships.gov.in'
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana (Girl Child Savings)',
    titleHindi: 'सुकन्या समृद्धि योजना',
    category: 'Women Empowerment',
    department: 'Department of Posts & Ministry of Finance',
    description: 'High-interest tax-free government savings scheme designed specifically for the education and marriage expense of girl children.',
    benefitAmount: '8.2% Compound Interest + Tax Exemption 80C',
    eligibility: [
      'Parents/Legal Guardians of Girl Child below 10 years of age',
      'Maximum 2 accounts per family (or 3 in case of twins/triplets)',
      'Indian citizen resident'
    ],
    requiredDocuments: [
      'Birth Certificate of Girl Child',
      'Guardian Aadhaar Card & PAN Card',
      'Address Proof'
    ],
    applicationDeadline: 'Continuous',
    featured: false,
    tags: ['Savings', 'Girl Child', 'High Interest', 'Tax Saving'],
    applySteps: [
      'Open account at any Post Office or Authorized Public Bank',
      'Deposit initial amount (Minimum ₹250)',
      'Receive Passbook & Track online via India Post Banking'
    ],
    officialUrl: 'https://www.indiapost.gov.in'
  },
  {
    id: 'pm-mudra-yojana',
    title: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    titleHindi: 'प्रधानमंत्री मुद्रा योजना',
    category: 'MSME & Business',
    department: 'Ministry of Finance & SIDBI',
    description: 'Collateral-free micro loans up to ₹10 Lakh for non-corporate, non-farm small and micro enterprises for business expansion or startup.',
    benefitAmount: 'Up to ₹ 10,00,000 Micro Loan',
    eligibility: [
      'Any Indian citizen running micro enterprises, artisans, shopkeepers, service providers',
      'Shishu category: up to ₹50,000; Kishore: ₹50k to ₹5L; Tarun: ₹5L to ₹10L',
      'No past banking default'
    ],
    requiredDocuments: [
      'Business Plan / Proposal',
      'Identity & Residence Proof (Aadhaar/Voter ID)',
      'Bank Statement of past 6 months',
      'Quotation for Machinery/Equipments (if any)'
    ],
    applicationDeadline: 'Continuous',
    featured: true,
    tags: ['Business Loan', 'Startup', 'No Collateral', 'MSME'],
    applySteps: [
      'Submit Business Proposal via UdyamiMitra / SathiX OS',
      'Loan Appraisal by Partner Bank / Microfinance Institution',
      'Issuance of MUDRA Debit Card for working capital',
      'Fund Transfer to Business Account'
    ],
    officialUrl: 'https://www.mudra.org.in'
  },
  {
    id: 'pm-vishwakarma',
    title: 'PM Vishwakarma Scheme (Artisans & Craftsmen)',
    titleHindi: 'पीएम विश्वकर्मा योजना',
    category: 'MSME & Business',
    department: 'Ministry of Micro, Small and Medium Enterprises',
    description: 'Comprehensive support including Skill Training, ₹15,000 Toolkit Incentive, and ₹3 Lakh collateral-free loan at 5% interest for traditional artisans.',
    benefitAmount: '₹ 15,000 Toolkit + ₹ 3 Lakh Loan @ 5%',
    eligibility: [
      'Artisans or Craftsmen working with hands and tools in 18 traditional trades (Blacksmith, Carpenter, Goldsmith, Potter, Weaver, Mason, Tailor, etc.)',
      'Minimum age 18 years',
      'One member per family'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Bank Account details',
      'Ration Card / Trade Proof'
    ],
    applicationDeadline: 'Continuous',
    featured: false,
    tags: ['Artisans', 'Craftsmen', 'Toolkit Support', 'Skill Training'],
    applySteps: [
      'Verification at Gram Panchayat / Urban Local Body',
      'District Implementation Committee Vetting',
      '5-7 Days Basic Skill Training with ₹500/day stipend',
      'Toolkit E-Voucher & Collateral-Free Credit Release'
    ],
    officialUrl: 'https://pmvishwakarma.gov.in'
  },
  {
    id: 'pm-svanidhi',
    title: 'PM SVANidhi (Street Vendor Loan Scheme)',
    titleHindi: 'पीएम स्वनिधि (स्ट्रीट वेंडर स्वावलंबन योजना)',
    category: 'Social Welfare',
    department: 'Ministry of Housing and Urban Affairs',
    description: 'Collateral-free working capital loan starting at ₹10,000 with 7% interest subsidy and cashback incentive for digital transactions for urban street vendors.',
    benefitAmount: '₹ 10,000 - ₹ 50,000 Working Capital Loan',
    eligibility: [
      'Street vendors engaged in vending in urban areas on or before March 24, 2020',
      'Possessing Certificate of Vending / ID card issued by Urban Local Bodies'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Certificate of Vending (COV) or Survey Letter',
      'Bank Account Details'
    ],
    applicationDeadline: 'Dec 2026',
    featured: false,
    tags: ['Street Vendors', 'Urban', 'Digital Cashbacks', 'Interest Subsidy'],
    applySteps: [
      'Application submission at CSC Centre or SathiX OS',
      'Verification by Municipal Nodal Officer',
      'Direct Disbursal via Partner Banks',
      'Cashback of up to ₹1,200/year on UPI transactions'
    ],
    officialUrl: 'https://pmsvanidhi.mohua.gov.in'
  }
];

export const MOCK_APPLICATIONS: ApplicationStatus[] = [
  {
    id: 'app-001',
    schemeId: 'pm-kisan',
    schemeTitle: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Agriculture',
    appliedDate: '12 Jan 2026',
    currentStep: 4,
    totalSteps: 4,
    statusText: 'Approved',
    statusColor: 'emerald',
    referenceNumber: 'PMK-UP-2026-98124',
    benefitAmount: '₹ 6,000 / year (Next Installment: ₹2,000 due 15 Aug)',
    timeline: [
      { title: 'Application Submitted', date: '12 Jan 2026', completed: true, description: 'Submitted via SathiX OS AI Assistant' },
      { title: 'Aadhaar e-KYC Verified', date: '14 Jan 2026', completed: true, description: 'Biometric & OTP verification successful' },
      { title: 'Land Revenue Inspection', date: '28 Jan 2026', completed: true, description: 'Tehsildar verified land parcel Khatauni 418/A' },
      { title: 'DBT Account Active', date: '02 Feb 2026', completed: true, active: true, description: 'Approved by State Nodal Officer. Ready for payment transfer.' }
    ]
  },
  {
    id: 'app-002',
    schemeId: 'ayushman-bharat',
    schemeTitle: 'Ayushman Bharat PM-JAY Golden Card',
    category: 'Healthcare',
    appliedDate: '04 Feb 2026',
    currentStep: 3,
    totalSteps: 4,
    statusText: 'Field Inspection',
    statusColor: 'cyan',
    referenceNumber: 'AB-JAY-2026-44210',
    benefitAmount: '₹ 5,00,000 Health Assurance',
    timeline: [
      { title: 'Aadhaar Family Matching', date: '04 Feb 2026', completed: true, description: 'Ration card family tree matched with SECC database' },
      { title: 'e-KYC Processing', date: '05 Feb 2026', completed: true, description: 'Aadhaar biometric validation passed' },
      { title: 'District Nodal Verification', date: 'In Progress', completed: false, active: true, description: 'Verification by Chief Medical Officer Varanasi' },
      { title: 'Golden Card Issuance', date: 'Pending', completed: false, description: 'Card ready for physical download & hospital use' }
    ]
  },
  {
    id: 'app-003',
    schemeId: 'pm-awas-yojana',
    schemeTitle: 'PMAY Rural Housing Subsidy',
    category: 'Housing',
    appliedDate: '20 May 2025',
    currentStep: 2,
    totalSteps: 4,
    statusText: 'Under Verification',
    statusColor: 'amber',
    referenceNumber: 'PMAY-G-UP-88192',
    benefitAmount: '₹ 1,20,000 Construction Grant',
    timeline: [
      { title: 'Gram Sabha Priority List Inclusion', date: '20 May 2025', completed: true, description: 'Selected under Priority 2 for Village Shivpur' },
      { title: 'Geo-Tagging of Plot', date: 'In Progress', completed: false, active: true, description: 'Block Development Officer site inspection scheduled' },
      { title: 'Installment 1 Release (₹40,000)', date: 'Pending', completed: false, description: 'Awaiting site photo upload' },
      { title: 'House Completion Certificate', date: 'Pending', completed: false, description: 'Final Geo-tagging after lintel construction' }
    ]
  }
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    name: 'Aadhaar Card (Verified UID)',
    type: 'Identity & Address Proof',
    uploadDate: '10 Jan 2026',
    status: 'Verified',
    size: '1.2 MB',
    iconName: 'ShieldCheck'
  },
  {
    id: 'doc-02',
    name: 'Land Record (Khatauni / Khasra)',
    type: 'Agriculture Property Proof',
    uploadDate: '12 Jan 2026',
    status: 'Verified',
    size: '2.4 MB',
    iconName: 'FileText'
  },
  {
    id: 'doc-03',
    name: 'Income Certificate (Tehsildar)',
    type: 'Income Verification',
    uploadDate: '15 Jan 2026',
    status: 'Verified',
    size: '890 KB',
    iconName: 'Award'
  },
  {
    id: 'doc-04',
    name: 'Ration Card (NFSA Priority Family)',
    type: 'Family & Food Security',
    uploadDate: '02 Feb 2026',
    status: 'Verified',
    size: '1.8 MB',
    iconName: 'Users'
  },
  {
    id: 'doc-05',
    name: 'Bank Passbook (Aadhaar Seeded)',
    type: 'DBT Payment Account',
    uploadDate: '10 Jan 2026',
    status: 'Verified',
    size: '950 KB',
    iconName: 'CreditCard'
  }
];

export const MOCK_CHAT_INITIAL: any[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Namaste Ramesh ji! 🙏 Welcome to **SathiX OS** — your Digital Citizen Assistant. How can I help you access government services today? You can ask me in Hindi, English, or 10+ Indian languages!',
    timestamp: '10:00 AM',
    actionPrompts: [
      'Which schemes am I eligible for?',
      'How can I apply for PM Kisan next installment?',
      'What documents do I need for Ayushman Bharat Card?',
      'Check status of my PMAY Housing Application'
    ]
  }
];

export const MOCK_AI_RESPONSES: Record<string, any> = {
  eligible: {
    text: 'Based on your profile (**Farmer, Resident of UP, Income < ₹2.5L**), you are eligible for **3 key government schemes** with combined financial benefits up to **₹5.16 Lakhs**:',
    schemes: [MOCK_SCHEMES[0], MOCK_SCHEMES[1], MOCK_SCHEMES[5]],
    actionPrompts: ['How do I apply for MUDRA Loan?', 'What is the status of my PM Kisan?', 'Upload new document']
  },
  scholarship: {
    text: 'For Education & Post-Matric Scholarships, students can get up to **₹25,000/year** tuition fee reimbursement + maintenance allowance under the **National Scholarship Portal (NSP)**.',
    schemes: [MOCK_SCHEMES[3]],
    actionPrompts: ['What documents are required for NSP?', 'Who is eligible for SC/ST scholarship?']
  },
  documents: {
    text: 'To apply for most Central & State welfare schemes, you need these **4 essential documents** linked with Aadhaar:\n\n1. 🆔 **Aadhaar Card** (Linked with active mobile number for OTP)\n2. 📄 **Income Certificate** (Issued by Revenue Officer/Tehsildar within 1 year)\n3. 🏦 **Aadhaar-Seeded Bank Passbook** (For Direct Benefit Transfer)\n4. 📜 **Ration Card / Caste Certificate** (If applicable)\n\nGood news! Your SathiX Document Vault already has **all 4 documents verified!**',
    actionPrompts: ['Apply for PM-KISAN now', 'Check MUDRA loan eligibility', 'Scan new document']
  },
  pmkisan: {
    text: 'Under **PM-KISAN**, farmer families receive **₹6,000 per year** in 3 equal installments of ₹2,000 directly into their bank accounts. \n\n🎉 **Great news**: Your application status is **APPROVED** (Ref: PMK-UP-2026-98124). Your 17th installment of ₹2,000 is scheduled for transfer on **15th August 2026**.',
    schemes: [MOCK_SCHEMES[0]],
    actionPrompts: ['View full application timeline', 'Update Bank Account Details', 'Ask another question']
  },
  default: {
    text: 'I understand you are asking about government services. With **SathiX OS**, you can explore over 500+ Central and State welfare schemes, compute eligibility instantly, and track DBT payments in your native language.',
    schemes: [MOCK_SCHEMES[0], MOCK_SCHEMES[1]],
    actionPrompts: ['Which schemes am I eligible for?', 'Show popular schemes', 'Contact Citizen Helpdesk']
  }
};

export const MOCK_ADMIN_STATS = {
  totalCitizens: '4,289,140',
  totalApplications: '1,842,910',
  aiQueriesToday: '142,580',
  dbtDisbursed: '₹ 485.4 Cr',
  satisfactionRate: '98.6%',
  avgResponseTime: '0.8s',
  languageBreakdown: [
    { language: 'Hindi', percentage: 48, count: '2.05M users' },
    { language: 'English', percentage: 22, count: '943K users' },
    { language: 'Tamil / Telugu', percentage: 14, count: '600K users' },
    { language: 'Marathi / Gujarati', percentage: 10, count: '428K users' },
    { language: 'Others (Bengali, Kannada, etc.)', percentage: 6, count: '257K users' },
  ],
  categoryShare: [
    { category: 'Agriculture & Farmers', count: '620,000 apps', percentage: 34 },
    { category: 'Healthcare & Insurance', count: '480,000 apps', percentage: 26 },
    { category: 'Social Welfare & Pensions', count: '310,000 apps', percentage: 17 },
    { category: 'Education & Scholarships', count: '240,000 apps', percentage: 13 },
    { category: 'Housing & Micro Loans', count: '192,910 apps', percentage: 10 },
  ]
};
