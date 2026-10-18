export type Faq = { q: string; q_as?: string; a: string; a_as?: string };

export const faqs: Faq[] = [
  {
    q: 'Does this app replace the official Dharitree portal?',
    q_as: 'এই এপে চৰকাৰী ধৰিত্ৰী পৰ্টেল সলনি কৰে নেকি?',
    a: 'No. It is an unofficial citizen companion app. Any legally relevant record must be obtained from the official portal.',
    a_as: 'নহয়। ই এটা অনানুষ্ঠানিক নাগৰিক সহায়ক এপ। আইনী ক্ষেত্ৰত কেৱল চৰকাৰী পৰ্টেলৰ অভিলেখহে গ্ৰহণযোগ্য।',
  },
  {
    q: 'How do I check my land record online?',
    q_as: 'মই অনলাইনত ভূমি অভিলেখ কেনেকৈ চাম?',
    a: 'Use the Land Record search inside this app to pick district / circle / village, then open the official Dharitree page to view the record and complete any CAPTCHA step.',
    a_as: 'এই এপৰ সন্ধান পৃষ্ঠাত জিলা / চক্ৰ / গাঁও বাছনি কৰি চৰকাৰী ধৰিত্ৰী পৃষ্ঠা খোলক আৰু কেপচা পূৰণ কৰক।',
  },
  {
    q: 'Why does the calculator show slightly different values than another tool?',
    q_as: 'হিচাপযন্ত্ৰে কিয় সৰু পাৰ্থক্য দেখুৱায়?',
    a: 'Local traditions use slightly different definitions of bigha. We use the standard Assam factors (1 bigha = 14,400 sq ft). Treat results as estimates.',
    a_as: 'বিঘাৰ পৰিমাপ অঞ্চলভেদে অলপ ভিন্ন। আমি অসমৰ মানবিহিত কাৰক ব্যৱহাৰ কৰোঁ (১ বিঘা = ১৪,৪০০ বৰ্গ ফুট)।',
  },
  {
    q: 'Can the app auto-solve the CAPTCHA?',
    q_as: 'এপে কেপচা স্বয়ংক্ৰিয়ভাৱে সমাধান কৰিব পাৰে নেকি?',
    a: 'No. CAPTCHAs are solved by the user on the official portal. The app will never bypass or share CAPTCHA answers.',
    a_as: 'নহয়। কেপচা ব্যৱহাৰকাৰীয়ে চৰকাৰী পৰ্টেলতেই পূৰণ কৰে।',
  },
  {
    q: 'Where does the weather data come from?',
    q_as: 'বতৰৰ তথ্য ক\'ৰ পৰা আহে?',
    a: 'From the public Open-Meteo API using district coordinates. Treat it as advisory and consult IMD for official alerts.',
    a_as: 'জিলাৰ স্থানাংক ব্যৱহাৰ কৰি ওপেন-মিটিঅ\'ৰ পৰা। চৰকাৰী সতৰ্কতাৰ বাবে আই এম ডি চাওক।',
  },
  {
    q: 'Is my data uploaded anywhere?',
    q_as: 'মোৰ তথ্য ক\'ৰবাত আপল\'ড হয় নেকি?',
    a: 'The app stores language and favourites locally. It does not create user accounts and does not upload personal data.',
    a_as: 'এপে কেৱল ভাষা আৰু পচন্দ স্থানীয়ভাৱে ৰাখে। কোনো ব্যক্তিগত তথ্য আপল\'ড নকৰে।',
  },
];
