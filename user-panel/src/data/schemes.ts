import { Scheme, Application, UserProfile } from '../types';

export const currentUser: UserProfile = {
  name: 'Ravi Kumar',
  nameHindi: 'रवि कुमार',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  state: 'Uttar Pradesh',
  district: 'Varanasi',
  village: 'Shivpur',
  age: 42,
  occupation: 'Small-scale Farmer',
  occupationHindi: 'लघु किसान (Small Farmer)',
  education: '10th Pass',
  educationHindi: '10वीं पास',
  annualIncome: 95000,
  landHoldingAcres: 2.4,
  rationCardType: 'BPL',
  gender: 'Male',
  casteCategory: 'OBC',
  maritalStatus: 'Married',
  isAadhaarLinked: true,
  isKycVerified: true,
  bankAccountLinked: true,
  preferredLanguage: 'en',
};

export const allSchemes: Scheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM-Kisan Scheme',
    titleHindi: 'प्रधानमंत्री किसान सम्मान निधि',
    subtitle: 'Income support for small & marginal farmers.',
    subtitleHindi: 'छोटे और सीमांत किसानों के लिए वित्तीय सहायता।',
    description: 'Direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly into the bank accounts of farmer families.',
    descriptionHindi: 'किसान परिवारों के बैंक खातों में सीधे ₹2,000 की तीन समान किस्तों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।',
    category: 'agriculture',
    categoryLabel: 'Agriculture',
    matchPercentage: 95,
    matchReason: 'Matches small farmer landholding (< 2.5 acres) and linked Aadhaar DBT bank account in Uttar Pradesh.',
    iconType: 'tractor',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    benefitAmount: '₹6,000 / year',
    benefitAmountHindi: '₹6,000 / प्रति वर्ष',
    eligibility: [
      'Small and marginal farmer families',
      'Cultivable landholding up to 2 hectares (5 acres)',
      'Valid Aadhaar card linked to bank account',
      'Valid land records (Khasra/Khatauni)'
    ],
    eligibilityHindi: [
      'छोटे और सीमांत किसान परिवार',
      '2 हेक्टेयर (5 एकड़) तक कृषि योग्य भूमि',
      'बैंक खाते से लिंक आधार कार्ड',
      'वैध भू-अभिलेख (खसरा/खतौनी)'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Land Ownership Documents (Khatauni)',
      'Bank Account Passbook / IFSC Code',
      'Active Mobile Number'
    ],
    documentsRequiredHindi: [
      'आधार कार्ड',
      'भूमि स्वामित्व दस्तावेज (खतौनी)',
      'बैंक खाता पासबुक / आईएफएससी कोड',
      'सक्रिय मोबाइल नंबर'
    ],
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    officialPortalUrl: 'https://pmkisan.gov.in',
    isPopular: true,
  },
  {
    id: 'pm-fasal-bima',
    title: 'PM Fasal Bima Yojana',
    titleHindi: 'प्रधानमंत्री फसल बीमा योजना',
    subtitle: 'Comprehensive crop insurance against natural calamities, pests, and diseases.',
    subtitleHindi: 'प्राकृतिक आपदाओं, कीटों और बीमारियों के खिलाफ व्यापक फसल सुरक्षा बीमा।',
    description: 'Comprehensive crop insurance covering yield loss, standing crop damage, and post-harvest losses against unseasonal rains and natural hazards at nominal premium (1.5% to 2%).',
    descriptionHindi: 'कम प्रीमियम पर प्रतिकूल मौसम और कीट आपदाओं से होने वाले नुकसान की संपूर्ण फसल भरपाई।',
    category: 'agriculture',
    categoryLabel: 'Crop Insurance',
    matchPercentage: 88,
    matchReason: 'Active farmer in UP/Bihar cultivating food grains and pulses with bank credit linkage.',
    iconType: 'sprout',
    iconBgColor: 'bg-[#E3F2FD]',
    iconColor: 'text-[#2196F3]',
    benefitAmount: 'Up to ₹2,00,000 / hectare sum insured claim',
    benefitAmountHindi: '₹2,00,000 प्रति हेक्टेयर तक बीमा सुरक्षा',
    eligibility: [
      'All farmers including sharecroppers and tenant farmers',
      'Growing notified crops in notified agricultural areas',
      'Farmers with or without bank crop loans (loanee/non-loanee)'
    ],
    eligibilityHindi: [
      'बटाईदार और काश्तकार सहित सभी किसान',
      'अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले',
      'केसीसी ऋणधारक व गैर-ऋणधारक दोनों पात्र'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Land Records (Khatauni / LPC / RoR)',
      'Sowing Certificate / Crop Declaration',
      'Bank Account Passbook'
    ],
    documentsRequiredHindi: [
      'आधार कार्ड',
      'भू-अभिलेख (खतौनी / एलपीसी)',
      'बुवाई प्रमाण पत्र / फसल घोषणा',
      'बैंक खाता पासबुक'
    ],
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    officialPortalUrl: 'https://pmfby.gov.in',
    isPopular: true,
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat (PM-JAY)',
    titleHindi: 'आयुष्मान भारत (पीएम-जय)',
    subtitle: 'Health coverage up to ₹5 Lakh for low income families.',
    subtitleHindi: 'कम आय वाले परिवारों के लिए ₹5 लाख तक का मुफ्त स्वास्थ्य बीमा।',
    description: 'Cashless and paperless access to secondary and tertiary healthcare services for vulnerable families across empanelled public and private hospitals.',
    descriptionHindi: 'सूचीबद्ध सरकारी और निजी अस्पतालों में द्वितीयक और तृतीयक स्वास्थ्य सेवाओं के लिए कैशलेस और पेपरलेस उपचार।',
    category: 'health',
    categoryLabel: 'Healthcare',
    matchPercentage: 92,
    matchReason: 'Eligible based on SECC 2011 BPL rural household deprivation criteria.',
    iconType: 'shield-plus',
    iconBgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    benefitAmount: '₹5,00,000 / family / year',
    benefitAmountHindi: '₹5,00,000 / परिवार / वर्ष',
    eligibility: [
      'Families identified under SECC 2011 database',
      'BPL ration card holders',
      'Rural households with kutcha walls and kutcha roof',
      'No earning adult member between age 16-59'
    ],
    eligibilityHindi: [
      'एसईसीसी 2011 डेटाबेस के तहत चिन्हित परिवार',
      'बीपीएल राशन कार्ड धारक',
      'कच्ची दीवार और छत वाले ग्रामीण परिवार',
      '16-59 वर्ष के बीच कोई कमाने वाला वयस्क नहीं'
    ],
    documentsRequired: [
      'Aadhaar Card or Ration Card',
      'PM-JAY Letter / Family ID',
      'Mobile Number'
    ],
    documentsRequiredHindi: [
      'आधार कार्ड या राशन कार्ड',
      'पीएम-जय पत्र / परिवार पहचान पत्र',
      'मोबाइल नंबर'
    ],
    ministry: 'National Health Authority (NHA)',
    officialPortalUrl: 'https://pmjay.gov.in',
    isPopular: true,
  },
  {
    id: 'pm-awas-gramin',
    title: 'PM Awas Yojana (Gramin)',
    titleHindi: 'प्रधानमंत्री आवास योजना (ग्रामीण)',
    subtitle: 'Financial aid for pucca house construction.',
    subtitleHindi: 'पक्का मकान निर्माण के लिए ₹1.20 लाख की सीधी सहायता।',
    description: 'Provides financial assistance of ₹1.20 Lakh in plains and ₹1.30 Lakh in hilly/difficult areas to construct disaster-resilient pucca houses.',
    descriptionHindi: 'ग्रामीण क्षेत्रों में पक्के मकान बनाने के लिए ₹1.20 लाख की सीधी वित्तीय सहायता।',
    category: 'housing',
    categoryLabel: 'Housing',
    matchPercentage: 88,
    matchReason: 'Rural residence with verified Kutcha shelter category in UP.',
    iconType: 'home',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    benefitAmount: '₹1,20,000 assistance + 90 days MGNREGA wages',
    benefitAmountHindi: '₹1,20,000 सहायता + 90 दिन मनरेगा मजदूरी',
    eligibility: [
      'Houseless families or living in zero/one/two-room kutcha houses',
      'BPL category registered on Awaas+ portal',
      'Applicant should not own a pucca house anywhere in India'
    ],
    eligibilityHindi: [
      'बेघर परिवार या 1-2 कमरे वाले कच्चे घर में रहने वाले',
      'आवास+ पोर्टल पर पंजीकृत बीपीएल परिवार',
      'भारत में कहीं भी पक्का मकान नहीं होना चाहिए'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Bank Account Passbook (MGNREGA linked)',
      'Job Card Number',
      'Land Certificate / Site Photo'
    ],
    documentsRequiredHindi: [
      'आधार कार्ड',
      'बैंक खाता पासबुक',
      'मनरेगा जॉब कार्ड नंबर',
      'जमीन का प्रमाण / स्थल फोटो'
    ],
    ministry: 'Ministry of Rural Development',
    officialPortalUrl: 'https://pmayg.nic.in',
    isPopular: true,
  },
  {
    id: 'kisan-credit-card',
    title: 'Kisan Credit Card (KCC)',
    titleHindi: 'किसान क्रेडिट कार्ड',
    subtitle: 'Low-interest institutional credit for farming inputs.',
    subtitleHindi: 'खेती और खाद-बीज के लिए 4% रियायती ब्याज पर आसान लोन।',
    description: 'Single-window agricultural credit up to ₹3 Lakh at an effective interest rate of 4% per annum with prompt repayment incentive.',
    descriptionHindi: '4% रियायती ब्याज दर पर कृषि आदानों के लिए ₹3 लाख तक का आसान ऋण।',
    category: 'agriculture',
    categoryLabel: 'Agriculture & Credit',
    matchPercentage: 90,
    matchReason: 'Owner cultivator with active agricultural land in Varanasi.',
    iconType: 'sprout',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    benefitAmount: 'Credit limit up to ₹3,00,000 at 4% interest',
    benefitAmountHindi: '₹3,00,000 तक ऋण सीमा (4% ब्याज पर)',
    eligibility: [
      'Individual/joint borrower farmers who are owner cultivators',
      'Tenant farmers, oral lessees & sharecroppers',
      'Self Help Groups (SHGs) or Joint Liability Groups (JLGs)'
    ],
    eligibilityHindi: [
      'मालिक काश्तकार किसान',
      'बटाईदार और पट्टेदार किसान',
      'स्वयं सहायता समूह (SHG)'
    ],
    documentsRequired: [
      'Application Form & 2 Passport Photos',
      'Aadhaar Card & Voter ID',
      'Land Records (7/12, Khatauni)',
      'Crop Cultivation Proof'
    ],
    documentsRequiredHindi: [
      'आवेदन पत्र और 2 पासपोर्ट फोटो',
      'आधार कार्ड और मतदाता पहचान पत्र',
      'भू-अभिलेख (खतौनी)',
      'फसल बुवाई प्रमाण'
    ],
    ministry: 'Ministry of Finance / NABARD',
    officialPortalUrl: 'https://agricoop.nic.in',
    isPopular: false,
  },
  {
    id: 'pm-surya-ghar',
    title: 'PM Surya Ghar: Muft Bijli Yojana',
    titleHindi: 'पीएम सूर्य घर: मुफ्त बिजली योजना',
    subtitle: 'Free solar electricity up to 300 units per month.',
    subtitleHindi: 'छत पर सोलर पैनल और हर महीने 300 यूनिट तक मुफ्त बिजली।',
    description: 'Direct subsidy up to ₹78,000 for installing rooftop solar systems to get zero electricity bills and earn money by selling excess solar power.',
    descriptionHindi: 'छत पर सौर ऊर्जा संयंत्र लगाने के लिए ₹78,000 तक की प्रत्यक्ष सरकारी सब्सिडी।',
    category: 'energy',
    categoryLabel: 'Solar Energy',
    matchPercentage: 86,
    matchReason: 'Residential electricity consumer with individual roof space.',
    iconType: 'sun',
    iconBgColor: 'bg-amber-100',
    iconColor: 'text-amber-600',
    benefitAmount: 'Up to ₹78,000 central subsidy + 300 units free/mo',
    benefitAmountHindi: '₹78,000 तक केंद्रीय सब्सिडी + 300 यूनिट मुफ्त',
    eligibility: [
      'Applicant must be an Indian citizen',
      'Must own a residential house with a suitable roof',
      'Must have a valid domestic electricity connection'
    ],
    eligibilityHindi: [
      'आवेदक भारतीय नागरिक होना चाहिए',
      'उपयुक्त छत वाला आवासीय घर होना चाहिए',
      'वैध घरेलू बिजली कनेक्शन होना चाहिए'
    ],
    documentsRequired: [
      'Recent Electricity Bill',
      'Aadhaar Card',
      'Proof of House Ownership',
      'Bank Account Details'
    ],
    documentsRequiredHindi: [
      'हालिया बिजली बिल',
      'आधार कार्ड',
      'मकान स्वामित्व प्रमाण',
      'बैंक खाता विवरण'
    ],
    ministry: 'Ministry of New and Renewable Energy (MNRE)',
    officialPortalUrl: 'https://pmsuryaghar.gov.in',
    isPopular: false,
  },
  {
    id: 'jan-dhan',
    title: 'Jan Dhan Yojana (PMJDY)',
    titleHindi: 'प्रधानमंत्री जन धन योजना',
    subtitle: 'Zero balance savings account with RuPay debit card.',
    subtitleHindi: 'जीरो बैलेंस बैंक खाता, ₹2 लाख दुर्घटना बीमा व ओवरड्राफ्ट।',
    description: 'National mission for financial inclusion providing zero balance bank accounts, ₹2 Lakh accidental insurance cover, and ₹10,000 overdraft facility.',
    descriptionHindi: 'जीरो बैलेंस बैंक खाता, ₹2 लाख का मुफ्त दुर्घटना बीमा और ₹10,000 तक की ओवरड्राफ्ट सुविधा।',
    category: 'banking',
    categoryLabel: 'Banking & Inclusion',
    matchPercentage: 98,
    matchReason: 'Universal financial inclusion for all unbanked citizens.',
    iconType: 'bank',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    benefitAmount: 'Zero Balance + ₹2 Lakh Insurance + ₹10,000 OD',
    benefitAmountHindi: 'जीरो बैलेंस + ₹2 लाख बीमा + ₹10,000 ओवरड्राफ्ट',
    eligibility: [
      'Any Indian citizen aged 10 years and above',
      'No existing bank account required'
    ],
    eligibilityHindi: [
      '10 वर्ष और उससे अधिक आयु का कोई भी भारतीय नागरिक',
      'पूर्व बैंक खाता होना आवश्यक नहीं'
    ],
    documentsRequired: [
      'Aadhaar Card or Voter ID / MGNREGA Card',
      'Passport size photograph'
    ],
    documentsRequiredHindi: [
      'आधार कार्ड या मतदाता पहचान पत्र',
      'पासपोर्ट साइज फोटो'
    ],
    ministry: 'Department of Financial Services, Ministry of Finance',
    officialPortalUrl: 'https://pmjdy.gov.in',
    isPopular: true,
  },
  {
    id: 'ujjwala-yojana',
    title: 'PM Ujjwala Yojana (PMUY)',
    titleHindi: 'प्रधानमंत्री उज्ज्वला योजना',
    subtitle: 'Free LPG gas connection & refill subsidy for women.',
    subtitleHindi: 'महिलाओं के नाम पर मुफ्त एलपीजी गैस कनेक्शन और ₹300 सब्सिडी।',
    description: 'Free LPG gas connection with first cylinder and stove free, plus ₹300 per cylinder targeted subsidy directly into bank accounts.',
    descriptionHindi: 'गरीब परिवारों की महिलाओं को मुफ्त एलपीजी कनेक्शन, पहला भरा हुआ सिलेंडर और चूल्हा मुफ्त।',
    category: 'women',
    categoryLabel: 'Clean Fuel & Women',
    matchPercentage: 94,
    matchReason: 'BPL rural household with adult woman member without LPG connection.',
    iconType: 'flame',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    benefitAmount: 'Free LPG Connection + ₹300 subsidy / refill',
    benefitAmountHindi: 'मुफ्त एलपीजी कनेक्शन + ₹300 प्रति रिफिल सब्सिडी',
    eligibility: [
      'Adult woman from rural BPL / SC / ST / Most Backward Classes household',
      'No existing LPG connection in the same household',
      'Included in SECC list or 14-point declaration'
    ],
    eligibilityHindi: [
      'बीपीएल / एससी / एसटी परिवार की वयस्क महिला',
      'घर में पहले से कोई एलपीजी कनेक्शन न हो',
      'एसईसीसी सूची या 14-सूत्रीय घोषणा में शामिल'
    ],
    documentsRequired: [
      'Aadhaar of Applicant & Family Members',
      'BPL Ration Card',
      'Bank Account Passbook / IFSC',
      'Passport Photograph'
    ],
    documentsRequiredHindi: [
      'आवेदक और परिवार के सदस्यों का आधार',
      'बीपीएल राशन कार्ड',
      'बैंक खाता पासबुक',
      'पासपोर्ट फोटो'
    ],
    ministry: 'Ministry of Petroleum & Natural Gas',
    officialPortalUrl: 'https://pmuy.gov.in',
    isPopular: true,
  },
  {
    id: 'mgnrega',
    title: 'MGNREGA Scheme',
    titleHindi: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी',
    subtitle: 'Guaranteed 100 days of rural wage employment.',
    subtitleHindi: 'ग्रामीण परिवारों को वर्ष में 100 दिनों के रोजगार की कानूनी गारंटी।',
    description: 'Legal guarantee for at least 100 days of paid wage employment in every financial year to adult members willing to do unskilled manual work.',
    descriptionHindi: 'ग्रामीण अकुशल श्रमिकों को प्रति वर्ष कम से कम 100 दिनों का गारंटीशुदा मजदूरी रोजगार।',
    category: 'employment',
    categoryLabel: 'Rural Employment',
    matchPercentage: 91,
    matchReason: 'Adult resident in rural Gram Panchayat looking for local wage work.',
    iconType: 'user-check',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    benefitAmount: '100 days guaranteed wage (~₹230 - ₹350 / day)',
    benefitAmountHindi: '100 दिन गारंटीशुदा मजदूरी (~₹230 - ₹350 / दिन)',
    eligibility: [
      'Adult member (18+) of rural household',
      'Willing to do unskilled manual work',
      'Resident of local Gram Panchayat'
    ],
    eligibilityHindi: [
      'ग्रामीण परिवार का वयस्क सदस्य (18+)',
      'अकुशल शारीरिक श्रम करने का इच्छुक',
      'स्थानीय ग्राम पंचायत का निवासी'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Ration Card / Voter ID',
      'Bank / Post Office Account Passbook',
      'Passport Photo'
    ],
    documentsRequiredHindi: [
      'आधार कार्ड',
      'राशन कार्ड / वोटर आईडी',
      'बैंक / डाकघर पासबुक',
      'पासपोर्ट फोटो'
    ],
    ministry: 'Ministry of Rural Development',
    officialPortalUrl: 'https://nrega.nic.in',
    isPopular: true,
  },
];

export const initialApplications: Application[] = [
  {
    id: 'app-1',
    schemeId: 'pm-kisan',
    schemeTitle: 'PM-Kisan 17th Installment',
    schemeTitleHindi: 'पीएम किसान 17वीं किस्त सत्यापन',
    referenceNumber: 'PMK-2026-UP-88492',
    appliedDate: '12 Jul 2026',
    status: 'pending',
    currentStep: 2,
    totalSteps: 3,
    statusDescription: 'Under Verification by State Agriculture Nodal Officer (UP)',
    statusDescriptionHindi: 'राज्य कृषि नोडल अधिकारी (उत्तर प्रदेश) द्वारा सत्यापन जारी',
    timeline: [
      { title: 'Application & eKYC Submitted', date: '12 Jul 2026', completed: true },
      { title: 'Land Record & Khatauni Cross-Verification', date: '28 Jul 2026', completed: true, current: true },
      { title: 'PFMS Bank DBT Disbursal (₹2,000)', date: 'Expected 25 Aug 2026', completed: false },
    ],
  },
  {
    id: 'app-2',
    schemeId: 'pm-surya-ghar',
    schemeTitle: 'PM Surya Ghar: Rooftop Solar',
    schemeTitleHindi: 'पीएम सूर्य घर: सोलर रूफटॉप',
    referenceNumber: 'PMSG-2026-90211',
    appliedDate: '28 Jul 2026',
    status: 'pending',
    currentStep: 1,
    totalSteps: 3,
    statusDescription: 'DISCOM Technical Feasibility Inspection Scheduled',
    statusDescriptionHindi: 'डिस्कॉम तकनीकी व्यवहार्यता निरीक्षण निर्धारित',
    timeline: [
      { title: 'Online Registration & DISCOM Linkage', date: '28 Jul 2026', completed: true, current: true },
      { title: 'Rooftop Load & Meter Inspection', date: 'Pending DISCOM visit', completed: false },
      { title: 'Vendor Installation & Subsidy Credit', date: 'Awaiting inspection', completed: false },
    ],
  },
  {
    id: 'app-3',
    schemeId: 'ayushman-bharat',
    schemeTitle: 'Ayushman Bharat Golden Card',
    schemeTitleHindi: 'आयुष्मान भारत गोल्डन कार्ड',
    referenceNumber: 'AB-JAY-4491028',
    appliedDate: '02 Jun 2026',
    status: 'approved',
    currentStep: 3,
    totalSteps: 3,
    statusDescription: 'Card Generated & Active (e-Card ready for hospital admission)',
    statusDescriptionHindi: 'कार्ड सक्रिय व डाउनलोड के लिए तैयार (₹5 लाख मुफ्त उपचार)',
    timeline: [
      { title: 'Ration Card SECC Match Verified', date: '02 Jun 2026', completed: true },
      { title: 'Biometric Aadhaar Authentication', date: '05 Jun 2026', completed: true },
      { title: 'Golden Health Card Issued', date: '08 Jun 2026', completed: true },
    ],
  },
];

export const recentlyViewedIds = ['jan-dhan', 'ujjwala-yojana'];
export const savedSchemeIds = ['pm-kisan', 'ayushman-bharat', 'pm-awas-gramin', 'jan-dhan'];
