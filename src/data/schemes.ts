export type SchemeCategory =
  | 'agriculture'
  | 'rural'
  | 'housing'
  | 'pension'
  | 'education'
  | 'women_child'
  | 'employment'
  | 'health'
  | 'land_revenue';

export type Scheme = {
  id: string;
  name: string;
  name_as?: string;
  category: SchemeCategory;
  description: string;
  description_as?: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  steps: string[];
  officialUrl: string;
  source: string;
  verifiedOn: string; // ISO
};

export const schemeCategories: { key: SchemeCategory; label: string; label_as: string }[] = [
  { key:'agriculture', label:'Agriculture',       label_as:'কৃষি' },
  { key:'rural',       label:'Rural development', label_as:'গ্ৰাম্য উন্নয়ন' },
  { key:'housing',     label:'Housing',           label_as:'বাসস্থান' },
  { key:'pension',     label:'Pension',           label_as:'পেনচন' },
  { key:'education',   label:'Education',         label_as:'শিক্ষা' },
  { key:'women_child', label:'Women & child',     label_as:'মহিলা আৰু শিশু' },
  { key:'employment',  label:'Employment',        label_as:'নিযুক্তি' },
  { key:'health',      label:'Health',            label_as:'স্বাস্থ্য' },
  { key:'land_revenue',label:'Land & revenue',    label_as:'ভূমি আৰু ৰাজহ' },
];

export const schemes: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    name_as: 'প্ৰধানমন্ত্ৰী কিষাণ সন্মান নিধি',
    category: 'agriculture',
    description: 'Income support of ₹6,000 per year to all landholder farmer families, paid in three equal instalments.',
    description_as: 'ভূমি থকা কৃষক পৰিয়ালক বছৰি ₹৬,০০০ আৰ্থিক সহায়, তিনিটা সমান কিস্তিত।',
    eligibility: [
      'Landholding farmer family',
      'Not an institutional landholder',
      'No income-tax payer / government employee (subject to current rules)',
    ],
    benefits: ['₹6,000 per year direct benefit transfer in three instalments of ₹2,000.'],
    documents: ['Aadhaar', 'Land records (patta / jamabandi)', 'Bank account linked to Aadhaar'],
    steps: [
      'Visit pmkisan.gov.in and click “New Farmer Registration”.',
      'Fill details, upload documents and submit.',
      'Verify at the local Krishi Vikas Kendra / common service centre.',
    ],
    officialUrl: 'https://pmkisan.gov.in/',
    source: 'Ministry of Agriculture & Farmers Welfare',
    verifiedOn: '2026-10-11',
  },
  {
    id: 'orunodoi',
    name: 'Orunodoi 2.0',
    name_as: 'অৰুণোদয় ২.০',
    category: 'women_child',
    description: 'Monthly financial assistance to eligible women-headed families of Assam.',
    description_as: 'অসমৰ যোগ্য মহিলা মুৰব্বী পৰিয়ালক মাহিলী আৰ্থিক সহায়।',
    eligibility: ['Resident of Assam', 'Family not covered under income-tax / government employment', 'Woman head of household'],
    benefits: ['Monthly transfer (amount as notified by the state) to a bank account.'],
    documents: ['Aadhaar', 'Ration card', 'Bank passbook', 'Residence proof'],
    steps: [
      'Visit the Orunodoi portal or local block office.',
      'Submit application with supporting documents.',
      'Track status online once registration is accepted.',
    ],
    officialUrl: 'https://finance.assam.gov.in/',
    source: 'Finance Department, Government of Assam',
    verifiedOn: '2026-10-12',
  },
  {
    id: 'basundhara',
    name: 'Mission Basundhara',
    name_as: 'মিছন বসুন্ধৰা',
    category: 'land_revenue',
    description: 'Flagship land-records settlement mission for mutation, partition, reclassification and settlement of Government land in Assam.',
    description_as: 'অসমৰ ভূমি অভিলেখ সম্পৰ্কীয় নামজাৰি, বিভাজন, পুনৰ-শ্ৰেণীবিভাজন আদিৰ অভিযান।',
    eligibility: ['Owner / rightful occupant with supporting documents'],
    benefits: ['Online mutation', 'Partition of land holdings', 'Reclassification and settlement services'],
    documents: ['Jamabandi / patta', 'Sale deed / inheritance document', 'Aadhaar', 'Mobile number'],
    steps: [
      'Visit basundhara.assam.gov.in.',
      'Register and select the required service.',
      'Upload documents and track application.',
    ],
    officialUrl: 'https://basundhara.assam.gov.in/',
    source: 'Revenue & Disaster Management Department, Assam',
    verifiedOn: '2026-10-11',
  },
  {
    id: 'pmay-g',
    name: 'PMAY-Gramin',
    name_as: 'প্ৰধানমন্ত্ৰী আৱাস যোজনা — গ্ৰাম্য',
    category: 'housing',
    description: 'Pucca house with basic amenities for rural homeless and those living in kutcha / dilapidated houses.',
    description_as: 'গ্ৰাম্য গৃহহীন আৰু কচা ঘৰত থকা সকলৰ বাবে পকী ঘৰ।',
    eligibility: ['Shortlisted in SECC-based beneficiary list', 'No pucca house in family'],
    benefits: ['Unit assistance of ₹1.20 lakh (plain) / ₹1.30 lakh (hilly / difficult areas)'],
    documents: ['Aadhaar', 'Bank account', 'Job card (MGNREGA)', 'Land / house details'],
    steps: ['Verify eligibility in PMAY-G AwaasApp / portal.', 'Approach Gram Panchayat for registration.', 'Track installments online.'],
    officialUrl: 'https://pmaymis.gov.in/',
    source: 'Ministry of Rural Development',
    verifiedOn: '2026-10-12',
  },
  {
    id: 'nsap-iglp',
    name: 'IGNOAPS (Old-age pension)',
    name_as: 'ইন্দিৰা গান্ধী বৃদ্ধ পেনচন',
    category: 'pension',
    description: 'Monthly old-age pension to BPL persons aged 60+.',
    description_as: '৬০ বছৰৰ ওপৰৰ বিপিএল ব্যক্তিক মাহিলী বৃদ্ধ পেনচন।',
    eligibility: ['Age ≥ 60', 'BPL household'],
    benefits: ['Monthly pension as per NSAP norms (centre + state top-up)'],
    documents: ['Age proof', 'BPL card', 'Bank account', 'Aadhaar'],
    steps: ['Apply at the block / revenue circle office.', 'Verification by Gaon Burha / officer.', 'Pension credited to bank monthly.'],
    officialUrl: 'https://nrega.nic.in/',
    source: 'Ministry of Rural Development',
    verifiedOn: '2026-10-12',
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat — PM-JAY',
    name_as: 'আয়ুষ্মান ভাৰত — পি এম জে এ ৱাই',
    category: 'health',
    description: 'Cashless hospitalisation cover up to ₹5 lakh per family per year for secondary and tertiary care.',
    description_as: 'পৰিয়াল প্ৰতি বছৰি ₹৫ লাখলৈ নগদবিহীন চিকিৎসা সহায়।',
    eligibility: ['SECC-based entitled families; verify at pmjay.gov.in'],
    benefits: ['₹5 lakh cashless hospitalisation at empanelled hospitals'],
    documents: ['Aadhaar', 'Family ID / ration card'],
    steps: ['Check eligibility on pmjay.gov.in.', 'Get Ayushman Card from CSC / empanelled hospital.', 'Use card at empanelled facility.'],
    officialUrl: 'https://nha.gov.in/PM-JAY',
    source: 'National Health Authority',
    verifiedOn: '2026-10-12',
  },
  {
    id: 'pm-fasalbima',
    name: 'PM Fasal Bima Yojana',
    name_as: 'প্ৰধানমন্ত্ৰী ফচল বীমা যোজনা',
    category: 'agriculture',
    description: 'Crop insurance scheme covering yield losses from natural causes.',
    description_as: 'প্ৰাকৃতিক দুৰ্যোগৰ কাৰণে ফচল ক্ষতিৰ বীমা।',
    eligibility: ['All farmers growing notified crops (loanee + non-loanee)'],
    benefits: ['Insurance cover for notified crops at subsidised premium.'],
    documents: ['Aadhaar', 'Land records', 'Bank account', 'Sowing certificate'],
    steps: ['Enrol via bank / CSC / pmfby.gov.in before cut-off date.', 'In case of loss, intimate within 72 hours.', 'Claim settled through DBT.'],
    officialUrl: 'https://pmfby.gov.in/',
    source: 'Ministry of Agriculture & Farmers Welfare',
    verifiedOn: '2026-10-11',
  },
  {
    id: 'nmms',
    name: 'National Means-cum-Merit Scholarship',
    name_as: 'জাতীয় উপায়-যোগ্যতা বৃত্তি',
    category: 'education',
    description: 'Scholarship of ₹12,000/year for class 9–12 students from economically weaker families.',
    description_as: '৯ম–১২শ শ্ৰেণীৰ অৰ্থনৈতিকভাৱে দুৰ্বল ছাত্ৰ-ছাত্ৰীৰ বাবে বছৰি ₹১২,০০০ বৃত্তি।',
    eligibility: ['Family income within prescribed limit', 'Pass qualifying exam in Class 8'],
    benefits: ['₹12,000 per year up to Class 12.'],
    documents: ['Income certificate', 'Marksheet', 'Aadhaar', 'Bank account'],
    steps: ['Appear for the state-level selection exam.', 'Apply on scholarships.gov.in after qualifying.', 'Renew annually.'],
    officialUrl: 'https://scholarships.gov.in/',
    source: 'Ministry of Education',
    verifiedOn: '2026-10-11',
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA',
    name_as: 'মহাত্মা গান্ধী ৰাষ্ট্ৰীয় গ্ৰাম্য নিযুক্তি গেৰান্টি আঁচনি',
    category: 'employment',
    description: 'Guaranteed 100 days of wage employment in a financial year to every rural household.',
    description_as: 'গ্ৰাম্য পৰিয়ালক বছৰত নিশ্চিত ১০০ দিনৰ মজুৰিত নিযুক্তি।',
    eligibility: ['Adult member of a rural household willing to do unskilled manual work'],
    benefits: ['Up to 100 days of wage employment per year, as per state wage rate.'],
    documents: ['Aadhaar', 'Bank / post-office account', 'Residence proof'],
    steps: ['Apply for a job card at Gram Panchayat.', 'Demand work; employment within 15 days.', 'Wages credited to bank account.'],
    officialUrl: 'https://nrega.nic.in/',
    source: 'Ministry of Rural Development',
    verifiedOn: '2026-10-11',
  },
  {
    id: 'ekhajana',
    name: 'e-Khajana (online land revenue)',
    name_as: 'ই-খাজনা (অনলাইন ভূমি ৰাজহ)',
    category: 'land_revenue',
    description: 'Online payment of land revenue / khajana for Assam patta holders.',
    description_as: 'অসমৰ পাট্টাধাৰীসকলৰ বাবে অনলাইন ভূমি কৰ পৰিশোধ।',
    eligibility: ['Pattadar whose land is settled in Assam'],
    benefits: ['Pay land revenue online', 'Download receipts'],
    documents: ['Patta / jamabandi reference', 'District / circle / village details'],
    steps: ['Visit the Dharitree / ILRMS e-Khajana service.', 'Select location and patta.', 'Pay online and download receipt.'],
    officialUrl: 'https://landrevenue.assam.gov.in/',
    source: 'Revenue & Disaster Management Department, Assam',
    verifiedOn: '2026-10-12',
  },
];
