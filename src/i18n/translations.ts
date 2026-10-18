export type Lang = 'en' | 'as' | 'hi';

type Dict = Record<string, { en: string; as: string; hi: string }>;

export const dict: Dict = {
  'app.title':             { en: 'Assam Land Records – Dharitre',       as: 'অসম ভূমি অভিলেখ — ধৰিত্ৰী',  hi: 'असम भूमि अभिलेख – धरीत्री' },
  'app.subtitle':          { en: 'Land Records Companion',              as: 'ভূমি অভিলেখ সহায়ক',         hi: 'भूमि अभिलेख सहायक' },
  'app.unofficial':        { en: 'Unofficial citizen companion app',    as: 'অনানুষ্ঠানিক নাগৰিক সহায়ক এপ', hi: 'अनौपचारिक नागरिक सहायक ऐप' },

  // Nav
  'nav.home':              { en: 'Home',           as: 'ঘৰ',       hi: 'होम' },
  'nav.search':            { en: 'Search',         as: 'সন্ধান',    hi: 'खोज' },
  'nav.schemes':           { en: 'Schemes',        as: 'আঁচনি',    hi: 'योजनाएँ' },
  'nav.news':              { en: 'News',           as: 'বাতৰি',    hi: 'समाचार' },
  'nav.more':              { en: 'More',           as: 'অধিক',     hi: 'और' },

  // Dashboard services
  'svc.landrecord':        { en: 'Check Land Record',   as: 'ভূমি অভিলেখ চাওক',       hi: 'भूमि अभिलेख देखें' },
  'svc.jamabandi':         { en: 'Jamabandi Guide',      as: 'জমাবন্দী নিৰ্দেশিকা',    hi: 'जमाबंदी गाइड' },
  'svc.basundhara':        { en: 'Mission Basundhara',   as: 'মিছন বসুন্ধৰা',          hi: 'मिशन बसुन्धरा' },
  'svc.bhunaksha':         { en: 'Land Map (Bhunaksha)', as: 'ভূনকশা মানচিত্ৰ',       hi: 'भू-नक्शा' },
  'svc.mutation':          { en: 'Mutation Info',        as: 'নামজাৰি তথ্য',          hi: 'नामांतरण जानकारी' },
  'svc.ekhajana':          { en: 'e-Khajana Guide',      as: 'ই-খাজনা নিৰ্দেশিকা',     hi: 'ई-खजाना गाइड' },
  'svc.calculator':        { en: 'Land Calculator',      as: 'ভূমি হিচাপ',             hi: 'भूमि कैलकुलेटर' },
  'svc.schemes':           { en: 'Government Schemes',   as: 'চৰকাৰী আঁচনি',          hi: 'सरकारी योजनाएँ' },
  'svc.weather':           { en: 'Weather',              as: 'বতৰ',                   hi: 'मौसम' },
  'svc.market':            { en: 'Market Prices',        as: 'বজাৰ মূল্য',             hi: 'बाज़ार भाव' },
  'svc.news':              { en: 'Latest News',          as: 'শেহতীয়া বাতৰি',         hi: 'ताज़ा समाचार' },
  'svc.saved':             { en: 'Saved Services',       as: 'সঞ্চিত সেৱা',            hi: 'सहेजी सेवाएँ' },
  'svc.faq':               { en: 'FAQs & Help',          as: 'সঘন প্ৰশ্ন আৰু সহায়',   hi: 'सवाल-जवाब और मदद' },
  'svc.stampduty':         { en: 'Stamp Duty Estimator', as: 'ষ্টাম্প শুল্ক আনুমানিক', hi: 'स्टाम्प शुल्क अनुमान' },
  'svc.emi':               { en: 'EMI Calculator',       as: 'ই এম আই হিচাপ',         hi: 'ईएमआई कैलकुलेटर' },

  // Common
  'common.search':         { en: 'Search',          as: 'সন্ধান কৰক',    hi: 'खोजें' },
  'common.reset':          { en: 'Reset',           as: 'পুনৰায়',       hi: 'रीसेट' },
  'common.district':       { en: 'District',        as: 'জিলা',         hi: 'ज़िला' },
  'common.circle':         { en: 'Circle',          as: 'ৰাজহ চক্ৰ',    hi: 'राजस्व सर्कल' },
  'common.village':        { en: 'Village / Town',  as: 'গাঁও / চহৰ',   hi: 'गाँव / शहर' },
  'common.select':         { en: 'Select…',         as: 'বাছনি কৰক…',   hi: 'चुनें…' },
  'common.loading':        { en: 'Loading…',        as: 'লোড হৈ আছে…',  hi: 'लोड हो रहा है…' },
  'common.empty':          { en: 'No results',      as: 'কোনো ফলাফল নাই', hi: 'कोई परिणाम नहीं' },
  'common.open_portal':    { en: 'Open on official portal', as: 'চৰকাৰী পৰ্টেলত খোলক', hi: 'सरकारी पोर्टल पर खोलें' },
  'common.copy':           { en: 'Copy',            as: 'কপি কৰক',       hi: 'कॉपी' },
  'common.share':          { en: 'Share',           as: 'ভাগ কৰক',      hi: 'साझा' },
  'common.save':           { en: 'Save',            as: 'সঞ্চয় কৰক',   hi: 'सहेजें' },
  'common.cancel':         { en: 'Cancel',          as: 'বাতিল',        hi: 'रद्द' },
  'common.back':           { en: 'Back',            as: 'উভতি যাওক',    hi: 'वापस' },
  'common.retry':          { en: 'Retry',           as: 'পুনৰায় চেষ্টা কৰক', hi: 'पुनः प्रयास' },
  'common.error':          { en: 'Something went wrong', as: 'ক\'ৰবাত সমস্যা হ\'ল', hi: 'कुछ गड़बड़ हुई' },
  'common.offline':        { en: 'You appear to be offline', as: 'আপুনি অফলাইনত আছে', hi: 'आप ऑफलाइन दिख रहे हैं' },
  'common.last_updated':   { en: 'Last updated',    as: 'শেহতীয়া আপডেট', hi: 'अंतिम अपडेट' },
  'common.source':         { en: 'Source',          as: 'উৎস',          hi: 'स्रोत' },
  'common.disclaimer':     { en: 'Educational information only. Official records at government portals take precedence.', as: 'কেৱল শিক্ষামূলক তথ্য। চৰকাৰী পৰ্টেলৰ অভিলেখেই চূড়ান্ত।', hi: 'केवल शैक्षिक जानकारी। सरकारी पोर्टल के अभिलेख ही अंतिम हैं।' },

  // Home
  'home.greet':            { en: 'Hello',           as: 'নমস্কাৰ',       hi: 'नमस्ते' },
  'home.quick':            { en: 'Quick services',  as: 'ক্ষীপ্ৰ সেৱা',   hi: 'त्वरित सेवाएँ' },
  'home.tools':            { en: 'Tools & info',    as: 'সঁজুলি আৰু তথ্য', hi: 'उपकरण और जानकारी' },

  // Land search
  'ls.title':              { en: 'Find Land Record', as: 'ভূমি অভিলেখ বিচাৰক', hi: 'भूमि अभिलेख खोजें' },
  'ls.subtitle':           { en: 'Select location to search Dharitree', as: 'ধৰিত্ৰীত সন্ধানৰ বাবে স্থান বাছনি কৰক', hi: 'धरित्री में खोजने के लिए स्थान चुनें' },
  'ls.step1':              { en: 'Step 1 — Pick district',   as: 'পদক্ষেপ ১ — জিলা বাছনি', hi: 'चरण 1 — ज़िला चुनें' },
  'ls.step2':              { en: 'Step 2 — Pick revenue circle', as: 'পদক্ষেপ ২ — ৰাজহ চক্ৰ বাছনি', hi: 'चरण 2 — राजस्व सर्कल चुनें' },
  'ls.step3':              { en: 'Step 3 — Pick village or town', as: 'পদক্ষেপ ৩ — গাঁও বা চহৰ বাছনি', hi: 'चरण 3 — गाँव या शहर चुनें' },
  'ls.open_dharitree':     { en: 'Open on Dharitree portal', as: 'ধৰিত্ৰী পৰ্টেলত খোলক', hi: 'धरित्री पोर्टल पर खोलें' },
  'ls.notice_title':       { en: 'How this works',  as: 'এইটো কেনেকৈ কাম কৰে', hi: 'यह कैसे काम करता है' },
  'ls.notice_body':        { en: 'This app helps you pick the right location and takes you to the official Dharitree page. The app does not scrape, bypass CAPTCHA, or fabricate ownership information. Where an authorised public API becomes available, native results will appear here.', as: 'এই এপে আপোনাক সঠিক স্থান বাছনি কৰাত সহায় কৰে আৰু চৰকাৰী ধৰিত্ৰী পৃষ্ঠালৈ লৈ যায়। এপে স্ক্ৰেপিং, কেপচা অতিক্ৰম বা মিছা মালিকানাৰ তথ্য তৈয়াৰ নকৰে। অনুমোদিত এপিআই উপলব্ধ হ\'লে ফলাফল ইয়াতে দেখুৱা হ\'ব।', hi: 'यह ऐप आपको सही स्थान चुनने में मदद करता है और आपको आधिकारिक धरित्री पेज पर ले जाता है। ऐप स्क्रैपिंग, कैप्चा बायपास या नकली स्वामित्व जानकारी नहीं बनाता।' },

  // Calculator
  'calc.title':            { en: 'Land Measurement Calculator', as: 'ভূমি জোখ হিচাপ', hi: 'भूमि माप कैलकुलेटर' },
  'calc.subtitle':         { en: 'Offline conversions using Assam-specific factors', as: 'অসমীয়া জোখেৰে অফলাইন ৰূপান্তৰ', hi: 'असम-विशिष्ट कारकों के साथ ऑफलाइन रूपांतरण' },
  'calc.from':             { en: 'From unit',    as: 'ৰ পৰা',       hi: 'इकाई से' },
  'calc.to':               { en: 'To unit',      as: 'লৈ',         hi: 'इकाई तक' },
  'calc.value':            { en: 'Value',        as: 'মান',        hi: 'मान' },
  'calc.result':           { en: 'Result',       as: 'ফলাফল',      hi: 'परिणाम' },
  'calc.swap':             { en: 'Swap',         as: 'সলনি',       hi: 'अदला-बदली' },
  'calc.plot':             { en: 'Plot area calculator (L × B)', as: 'ভূমিৰ ক্ষেত্ৰফল (দৈৰ্ঘ্য × প্ৰস্থ)', hi: 'भूमि क्षेत्रफल (लंबाई × चौड़ाई)' },
  'calc.length':           { en: 'Length',       as: 'দৈৰ্ঘ্য',     hi: 'लंबाई' },
  'calc.breadth':          { en: 'Breadth',      as: 'প্ৰস্থ',      hi: 'चौड़ाई' },
  'calc.note':             { en: 'Estimates only — official land records take precedence.', as: 'কেৱল আনুমানিক — চৰকাৰী ভূমি অভিলেখেই চূড়ান্ত।', hi: 'केवल अनुमान — सरकारी भूमि अभिलेख ही अंतिम हैं।' },

  // Weather
  'wx.title':              { en: 'Weather',       as: 'বতৰ',         hi: 'मौसम' },
  'wx.pick_district':      { en: 'Pick a district', as: 'এটা জিলা বাছনি কৰক', hi: 'एक ज़िला चुनें' },
  'wx.now':                { en: 'Now',           as: 'এতিয়া',      hi: 'अभी' },
  'wx.forecast':           { en: '7-day forecast', as: '৭ দিনৰ পূৰ্বাভাস', hi: '7-दिन का पूर्वानुमान' },
  'wx.humidity':           { en: 'Humidity',      as: 'আৰ্দ্ৰতা',    hi: 'नमी' },
  'wx.wind':               { en: 'Wind',          as: 'বতাহ',       hi: 'हवा' },
  'wx.rain':               { en: 'Rain chance',   as: 'বৰষুণৰ সম্ভাৱনা', hi: 'वर्षा संभावना' },
  'wx.source':             { en: 'Source: Open-Meteo', as: 'উৎস: Open-Meteo', hi: 'स्रोत: Open-Meteo' },

  // Schemes
  'sch.title':             { en: 'Government Schemes', as: 'চৰকাৰী আঁচনি',   hi: 'सरकारी योजनाएँ' },
  'sch.search_ph':         { en: 'Search schemes…', as: 'আঁচনি সন্ধান…',  hi: 'योजनाएँ खोजें…' },
  'sch.category':          { en: 'Category',      as: 'শ্ৰেণী',        hi: 'श्रेणी' },
  'sch.all':               { en: 'All',           as: 'সকলো',         hi: 'सभी' },
  'sch.eligibility':       { en: 'Eligibility',   as: 'যোগ্যতা',       hi: 'पात्रता' },
  'sch.benefits':          { en: 'Benefits',      as: 'সুবিধা',       hi: 'लाभ' },
  'sch.documents':         { en: 'Documents',     as: 'নথিপত্ৰ',      hi: 'दस्तावेज़' },
  'sch.steps':             { en: 'How to apply',  as: 'আবেদন প্ৰক্ৰিয়া', hi: 'आवेदन कैसे करें' },
  'sch.apply':             { en: 'Apply on official site', as: 'চৰকাৰী ছাইটত আবেদন কৰক', hi: 'आधिकारिक साइट पर आवेदन करें' },

  // News
  'news.title':            { en: 'News & announcements', as: 'বাতৰি আৰু ঘোষণা', hi: 'समाचार और घोषणाएँ' },
  'news.by_source':        { en: 'By source',     as: 'উৎস অনুসৰি',   hi: 'स्रोत के अनुसार' },
  'news.open_article':     { en: 'Open article',  as: 'লেখা খোলক',    hi: 'लेख खोलें' },
  'news.local':            { en: 'Local (Assam)', as: 'স্থানীয় (অসম)', hi: 'स्थानीय (असम)' },

  // Settings
  'set.title':             { en: 'Settings',      as: 'ছেটিংছ',       hi: 'सेटिंग्स' },
  'set.language':          { en: 'Language',      as: 'ভাষা',         hi: 'भाषा' },
  'set.lang.en':           { en: 'English',       as: 'ইংৰাজী',       hi: 'अंग्रेज़ी' },
  'set.lang.as':           { en: 'Assamese (অসমীয়া)', as: 'অসমীয়া',      hi: 'असमिया (অসমীয়া)' },
  'set.lang.hi':           { en: 'Hindi (हिन्दी)',    as: 'হিন্দী (हिन्दी)', hi: 'हिन्दी' },
  'set.about':             { en: 'About this app', as: 'এপৰ বিষয়ে',   hi: 'इस ऐप के बारे में' },

  // Footer / official
  'official.badge':        { en: 'Official link', as: 'চৰকাৰী সংযোগ', hi: 'आधिकारिक लिंक' },
};

export const t = (key: string, lang: Lang): string => {
  const entry = dict[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
};

// Convenience picker for inline strings that aren't in `dict`.
// Falls back hi → as → en when a translation is missing for the active lang.
export function pick(lang: Lang, en: string, as?: string, hi?: string): string {
  if (lang === 'hi') return hi ?? en;
  if (lang === 'as') return as ?? en;
  return en;
}
