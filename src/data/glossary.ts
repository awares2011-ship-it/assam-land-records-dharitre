export type GlossaryEntry = {
  term: string;
  term_as?: string;
  meaning: string;
  meaning_as?: string;
};

export const glossary: GlossaryEntry[] = [
  { term:'Dag',       term_as:'দাগ',          meaning:'A plot (parcel) of land identified by a unique number in a village revenue map.', meaning_as:'এটা গাঁৱৰ ৰাজহ মানচিত্ৰত সুনিৰ্দিষ্ট নম্বৰেৰে চিহ্নিত ভূমিৰ এটা খণ্ড।' },
  { term:'Patta',     term_as:'পাট্টা',       meaning:'Document of land title / settlement issued by the government.', meaning_as:'চৰকাৰে প্ৰদান কৰা ভূমিৰ স্বত্বাধিকাৰৰ নথি।' },
  { term:'Jamabandi', term_as:'জমাবন্দী',    meaning:'Record of Rights listing owners, dags, areas and revenue for a village.', meaning_as:'গাঁও এখনৰ ভূমিৰ মালিক, দাগ, মাপ আৰু ৰাজহ সম্পৰ্কীয় স্বত্বাভিলেখ।' },
  { term:'Mutation (Namjari)', term_as:'নামজাৰি', meaning:'Updating ownership in the record of rights after sale / inheritance.', meaning_as:'ক্ৰয়-বিক্ৰয় বা উত্তৰাধিকাৰৰ পাছত স্বত্বাভিলেখত মালিকানা সলনি।' },
  { term:'Chitha',    term_as:'চিথা',         meaning:'Village field book maintained by the circle office.', meaning_as:'ৰাজহ চক্ৰ কাৰ্যালয়ত ৰখা গাঁৱৰ ক্ষেত্ৰ পঞ্জী।' },
  { term:'Bigha',     term_as:'বিঘা',         meaning:'Traditional land-measurement unit used in Assam (3 bigha = 1 acre, approx).', meaning_as:'অসমত ব্যৱহৃত পৰম্পৰাগত জোখ (প্ৰায় ৩ বিঘা = ১ একৰ)।' },
  { term:'Katha',     term_as:'কঠা',          meaning:'Sub-unit of bigha (1 bigha = 5 katha in Assam).', meaning_as:'বিঘাৰ উপ-একক (অসমত ১ বিঘা = ৫ কঠা)।' },
  { term:'Lecha',     term_as:'লেছা',         meaning:'Sub-unit of katha (1 katha = 20 lecha in Assam).', meaning_as:'কঠাৰ উপ-একক (অসমত ১ কঠা = ২০ লেছা)।' },
  { term:'Khajana',   term_as:'খাজনা',        meaning:'Annual land revenue paid to the government.', meaning_as:'চৰকাৰক পৰিশোধ কৰা বাৰ্ষিক ভূমি ৰাজহ।' },
  { term:'Mouza',     term_as:'মৌজা',         meaning:'Revenue sub-division containing several villages, headed by a Mouzadar.', meaning_as:'কেইবাখন গাঁৱেৰে গঠিত ৰাজহ উপ-বিভাগ, মৌজাদাৰৰ দায়িত্বত থাকে।' },
  { term:'Dharitree', term_as:'ধৰিত্ৰী',       meaning:"Government of Assam's online land records system.", meaning_as:'অসম চৰকাৰৰ অনলাইন ভূমি অভিলেখ ব্যৱস্থা।' },
  { term:'Bhunaksha', term_as:'ভূনকশা',       meaning:'Cadastral map viewer showing plot boundaries.', meaning_as:'ভূমিৰ সীমা দেখুৱা মানচিত্ৰ দৰ্শক।' },
];
