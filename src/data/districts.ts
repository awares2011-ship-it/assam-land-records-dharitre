// Assam districts, Dharitree-style revenue circles and representative villages.
// Verified against Government of Assam district reorganisation (post-2022 reshuffle).
// Village lists below are *representative starter sets*, not exhaustive — the
// official Dharitree portal returns the authoritative lists per circle.
//
// NOTE: Keep this file English-only; the UI uses the Assamese rendering via
// bilingual labels where provided.

export type Village = {
  code: string;
  name: string;
  name_as?: string;
};

export type Circle = {
  code: string;
  name: string;
  name_as?: string;
  villages: Village[];
};

export type District = {
  code: string;
  name: string;
  name_as?: string;
  circles: Circle[];
};

const v = (code: string, name: string, name_as?: string): Village => ({ code, name, name_as });

export const districts: District[] = [
  {
    code: 'KAM',
    name: 'Kamrup Metropolitan',
    name_as: 'কামৰূপ (মেট্ৰ\'পলিটন)',
    circles: [
      {
        code: 'KAM-GHY',
        name: 'Guwahati',
        name_as: 'গুৱাহাটী',
        villages: [
          v('GHY-01', 'Beltola',          'বেলতলা'),
          v('GHY-02', 'Dispur',           'দিছপুৰ'),
          v('GHY-03', 'Panbazar',         'পাণবজাৰ'),
          v('GHY-04', 'Jalukbari',        'জালুকবাৰী'),
          v('GHY-05', 'Noonmati',         'নুনমাটি'),
        ],
      },
      {
        code: 'KAM-SNT',
        name: 'Sonapur',
        name_as: 'সোণাপুৰ',
        villages: [
          v('SNT-01', 'Sonapur',  'সোণাপুৰ'),
          v('SNT-02', 'Khetri',   'ক্ষেত্ৰী'),
          v('SNT-03', 'Panikhaiti','পানীখাইটি'),
        ],
      },
      {
        code: 'KAM-CDK',
        name: 'Chandrapur',
        name_as: 'চন্দ্ৰপুৰ',
        villages: [
          v('CDK-01', 'Chandrapur', 'চন্দ্ৰপুৰ'),
          v('CDK-02', 'Narengi',    'নাৰেঙী'),
        ],
      },
      {
        code: 'KAM-NGS',
        name: 'North Guwahati',
        name_as: 'উত্তৰ গুৱাহাটী',
        villages: [
          v('NGS-01', 'North Guwahati', 'উত্তৰ গুৱাহাটী'),
          v('NGS-02', 'Amingaon',       'আমিনগাঁও'),
        ],
      },
    ],
  },
  {
    code: 'KMR',
    name: 'Kamrup',
    name_as: 'কামৰূপ',
    circles: [
      {
        code: 'KMR-RNG',
        name: 'Rangia',
        name_as: 'ৰঙিয়া',
        villages: [v('RNG-01','Rangia','ৰঙিয়া'), v('RNG-02','Nalbari Road','নলবাৰী ৰোড')],
      },
      {
        code: 'KMR-HJO',
        name: 'Hajo',
        name_as: 'হাজো',
        villages: [v('HJO-01','Hajo','হাজো'), v('HJO-02','Sualkuchi','শুৱালকুছি')],
      },
      {
        code: 'KMR-PLS',
        name: 'Palasbari',
        name_as: 'পলাশবাৰী',
        villages: [v('PLS-01','Palasbari','পলাশবাৰী'), v('PLS-02','Mirza','মিৰ্জা')],
      },
    ],
  },
  { code:'BRP', name:'Barpeta',   name_as:'বৰপেটা',  circles:[
      { code:'BRP-BRP', name:'Barpeta',   name_as:'বৰপেটা', villages:[v('BRP-1','Barpeta Town','বৰপেটা চহৰ')]},
      { code:'BRP-SRB', name:'Sarthebari',name_as:'সৰ্থেবাৰী', villages:[v('BRP-2','Sarthebari','সৰ্থেবাৰী')]},
      { code:'BRP-BJN', name:'Bajali',    name_as:'বাজালী', villages:[v('BRP-3','Pathsala','পাঠশালা')]},
  ]},
  { code:'NLB', name:'Nalbari',   name_as:'নলবাৰী',  circles:[
      { code:'NLB-NLB', name:'Nalbari',  name_as:'নলবাৰী', villages:[v('NLB-1','Nalbari','নলবাৰী')]},
      { code:'NLB-TPM', name:'Tihu',     name_as:'তিহু',   villages:[v('NLB-2','Tihu','তিহু')]},
  ]},
  { code:'BKS', name:'Baksa',     name_as:'বাক্সা',  circles:[
      { code:'BKS-SLS', name:'Salbari',   name_as:'শালবাৰী', villages:[v('BKS-1','Salbari','শালবাৰী')]},
      { code:'BKS-BAG', name:'Baganpara', name_as:'বাগানপাৰা', villages:[v('BKS-2','Baganpara','বাগানপাৰা')]},
  ]},
  { code:'DRG', name:'Darrang',   name_as:'দৰং',    circles:[
      { code:'DRG-MGL', name:'Mangaldai', name_as:'মঙলদৈ',  villages:[v('DRG-1','Mangaldai','মঙলদৈ')]},
      { code:'DRG-SPA', name:'Sipajhar',  name_as:'সিপাঝাৰ', villages:[v('DRG-2','Sipajhar','সিপাঝাৰ')]},
  ]},
  { code:'UDG', name:'Udalguri',  name_as:'উদালগুৰি', circles:[
      { code:'UDG-UDG', name:'Udalguri', name_as:'উদালগুৰি', villages:[v('UDG-1','Udalguri','উদালগুৰি')]},
      { code:'UDG-TLB', name:'Tangla',   name_as:'তাংলা',    villages:[v('UDG-2','Tangla','তাংলা')]},
  ]},
  { code:'SNT', name:'Sonitpur',  name_as:'শোণিতপুৰ', circles:[
      { code:'SNT-TZP', name:'Tezpur',    name_as:'তেজপুৰ',   villages:[v('SNT-1','Tezpur','তেজপুৰ')]},
      { code:'SNT-RGP', name:'Rangapara', name_as:'ৰঙাপাৰা',  villages:[v('SNT-2','Rangapara','ৰঙাপাৰা')]},
      { code:'SNT-DKM', name:'Dhekiajuli',name_as:'ঢেকিয়াজুলি',villages:[v('SNT-3','Dhekiajuli','ঢেকিয়াজুলি')]},
  ]},
  { code:'BIS', name:'Biswanath', name_as:'বিশ্বনাথ', circles:[
      { code:'BIS-BWC', name:'Biswanath Chariali', name_as:'বিশ্বনাথ চাৰিআলি', villages:[v('BIS-1','Biswanath Chariali','বিশ্বনাথ চাৰিআলি')]},
      { code:'BIS-GHR', name:'Gohpur',   name_as:'গহপুৰ',   villages:[v('BIS-2','Gohpur','গহপুৰ')]},
  ]},
  { code:'LKP', name:'Lakhimpur', name_as:'লখিমপুৰ', circles:[
      { code:'LKP-NLG', name:'North Lakhimpur', name_as:'উত্তৰ লখিমপুৰ', villages:[v('LKP-1','North Lakhimpur','উত্তৰ লখিমপুৰ')]},
      { code:'LKP-BWJ', name:'Bihpuria', name_as:'বিহপুৰীয়া', villages:[v('LKP-2','Bihpuria','বিহপুৰীয়া')]},
  ]},
  { code:'DHS', name:'Dhemaji',   name_as:'ধেমাজি',  circles:[
      { code:'DHS-DMJ', name:'Dhemaji',  name_as:'ধেমাজি', villages:[v('DHS-1','Dhemaji','ধেমাজি')]},
      { code:'DHS-JNR', name:'Jonai',    name_as:'জোনাই',  villages:[v('DHS-2','Jonai','জোনাই')]},
  ]},
  { code:'MJL', name:'Majuli',    name_as:'মাজুলী',  circles:[
      { code:'MJL-GPR', name:'Garamur',  name_as:'গড়মূৰ', villages:[v('MJL-1','Garamur','গড়মূৰ')]},
      { code:'MJL-UJL', name:'Ujoni Majuli', name_as:'উজনি মাজুলী', villages:[v('MJL-2','Kamalabari','কমলাবাৰী')]},
  ]},
  { code:'JHT', name:'Jorhat',    name_as:'জোৰহাট',  circles:[
      { code:'JHT-JOR', name:'Jorhat',   name_as:'জোৰহাট', villages:[v('JHT-1','Jorhat','জোৰহাট')]},
      { code:'JHT-TTB', name:'Titabor',  name_as:'তিতাবৰ', villages:[v('JHT-2','Titabor','তিতাবৰ')]},
  ]},
  { code:'SIV', name:'Sivasagar', name_as:'শিৱসাগৰ', circles:[
      { code:'SIV-SVG', name:'Sivasagar', name_as:'শিৱসাগৰ', villages:[v('SIV-1','Sivasagar','শিৱসাগৰ')]},
      { code:'SIV-DMJ', name:'Demow',     name_as:'ডিমৌ',    villages:[v('SIV-2','Demow','ডিমৌ')]},
      { code:'SIV-NZR', name:'Nazira',    name_as:'নাজিৰা',  villages:[v('SIV-3','Nazira','নাজিৰা')]},
  ]},
  { code:'CHR', name:'Charaideo', name_as:'চৰাইদেউ', circles:[
      { code:'CHR-SNR', name:'Sonari',   name_as:'সোণাৰি',  villages:[v('CHR-1','Sonari','সোণাৰি')]},
      { code:'CHR-MHM', name:'Mahmara',  name_as:'মহমৰা',   villages:[v('CHR-2','Mahmara','মহমৰা')]},
  ]},
  { code:'DBG', name:'Dibrugarh', name_as:'ডিব্ৰুগড়',  circles:[
      { code:'DBG-DBR', name:'Dibrugarh East', name_as:'ডিব্ৰুগড় পূব', villages:[v('DBG-1','Dibrugarh','ডিব্ৰুগড়')]},
      { code:'DBG-CBD', name:'Chabua',   name_as:'চাবুৱা', villages:[v('DBG-2','Chabua','চাবুৱা')]},
      { code:'DBG-NHR', name:'Naharkatia', name_as:'নাহৰকাটিয়া', villages:[v('DBG-3','Naharkatia','নাহৰকাটিয়া')]},
  ]},
  { code:'TKS', name:'Tinsukia',  name_as:'তিনিচুকীয়া', circles:[
      { code:'TKS-TNS', name:'Tinsukia', name_as:'তিনিচুকীয়া', villages:[v('TKS-1','Tinsukia','তিনিচুকীয়া')]},
      { code:'TKS-DGR', name:'Doom Dooma', name_as:'ডুম ডুমা', villages:[v('TKS-2','Doom Dooma','ডুম ডুমা')]},
      { code:'TKS-MGN', name:'Margherita', name_as:'মাৰ্ঘেৰিটা', villages:[v('TKS-3','Margherita','মাৰ্ঘেৰিটা')]},
  ]},
  { code:'GLG', name:'Golaghat',  name_as:'গোলাঘাট', circles:[
      { code:'GLG-GLG', name:'Golaghat',  name_as:'গোলাঘাট', villages:[v('GLG-1','Golaghat','গোলাঘাট')]},
      { code:'GLG-BKK', name:'Bokakhat',  name_as:'বোকাখাত', villages:[v('GLG-2','Bokakhat','বোকাখাত')]},
      { code:'GLG-DRG', name:'Dergaon',   name_as:'দেৰগাঁও', villages:[v('GLG-3','Dergaon','দেৰগাঁও')]},
  ]},
  { code:'NGN', name:'Nagaon',    name_as:'নগাঁও',   circles:[
      { code:'NGN-NGN', name:'Nagaon',    name_as:'নগাঁও',   villages:[v('NGN-1','Nagaon','নগাঁও')]},
      { code:'NGN-KPL', name:'Kampur',    name_as:'কমপুৰ',   villages:[v('NGN-2','Kampur','কমপুৰ')]},
      { code:'NGN-DBK', name:'Dhing',     name_as:'ঢিং',     villages:[v('NGN-3','Dhing','ঢিং')]},
  ]},
  { code:'HJI', name:'Hojai',     name_as:'হোজাই',   circles:[
      { code:'HJI-HJI', name:'Hojai',     name_as:'হোজাই',   villages:[v('HJI-1','Hojai','হোজাই')]},
      { code:'HJI-LMR', name:'Lanka',     name_as:'লংকা',    villages:[v('HJI-2','Lanka','লংকা')]},
  ]},
  { code:'MOR', name:'Morigaon',  name_as:'মৰিগাঁও', circles:[
      { code:'MOR-MRG', name:'Morigaon',  name_as:'মৰিগাঁও', villages:[v('MOR-1','Morigaon','মৰিগাঁও')]},
      { code:'MOR-MKP', name:'Mikir Bhetha', name_as:'মিকিৰ ভেথা', villages:[v('MOR-2','Mikir Bhetha','মিকিৰ ভেথা')]},
  ]},
  { code:'KBA', name:'Karbi Anglong', name_as:'কাৰ্বি আংলং', circles:[
      { code:'KBA-DPR', name:'Diphu',     name_as:'ডিফু',    villages:[v('KBA-1','Diphu','ডিফু')]},
      { code:'KBA-BKJ', name:'Bokajan',   name_as:'বোকাজান', villages:[v('KBA-2','Bokajan','বোকাজান')]},
  ]},
  { code:'WKA', name:'West Karbi Anglong', name_as:'পশ্চিম কাৰ্বি আংলং', circles:[
      { code:'WKA-HMN', name:'Hamren',    name_as:'হাঁমৰেন', villages:[v('WKA-1','Hamren','হাঁমৰেন')]},
  ]},
  { code:'DHM', name:'Dima Hasao', name_as:'ডিমা হাছাও', circles:[
      { code:'DHM-HFL', name:'Haflong',   name_as:'হাফলং',    villages:[v('DHM-1','Haflong','হাফলং')]},
      { code:'DHM-MBD', name:'Maibang',   name_as:'মাইবং',    villages:[v('DHM-2','Maibang','মাইবং')]},
  ]},
  { code:'CCR', name:'Cachar',    name_as:'কাছাৰ',   circles:[
      { code:'CCR-SLG', name:'Silchar',   name_as:'শিলচৰ',    villages:[v('CCR-1','Silchar','শিলচৰ')]},
      { code:'CCR-SNB', name:'Sonai',     name_as:'সোণাই',    villages:[v('CCR-2','Sonai','সোণাই')]},
      { code:'CCR-UCB', name:'Udharbond', name_as:'উধাৰবন্দ', villages:[v('CCR-3','Udharbond','উধাৰবন্দ')]},
  ]},
  { code:'HLK', name:'Hailakandi', name_as:'হাইলাকান্দি', circles:[
      { code:'HLK-HLK', name:'Hailakandi', name_as:'হাইলাকান্দি', villages:[v('HLK-1','Hailakandi','হাইলাকান্দি')]},
      { code:'HLK-LLB', name:'Lala',      name_as:'লালা',     villages:[v('HLK-2','Lala','লালা')]},
  ]},
  { code:'KRM', name:'Karimganj', name_as:'কৰিমগঞ্জ',  circles:[
      { code:'KRM-KGJ', name:'Karimganj', name_as:'কৰিমগঞ্জ',  villages:[v('KRM-1','Karimganj','কৰিমগঞ্জ')]},
      { code:'KRM-BDR', name:'Badarpur',  name_as:'বদৰপুৰ',    villages:[v('KRM-2','Badarpur','বদৰপুৰ')]},
      { code:'KRM-RMK', name:'Ramkrishna Nagar', name_as:'ৰামকৃষ্ণ নগৰ', villages:[v('KRM-3','Ramkrishna Nagar','ৰামকৃষ্ণ নগৰ')]},
  ]},
  { code:'DBR', name:'Dhubri',    name_as:'ধুবুৰী',    circles:[
      { code:'DBR-DBR', name:'Dhubri',    name_as:'ধুবুৰী',    villages:[v('DBR-1','Dhubri','ধুবুৰী')]},
      { code:'DBR-GPR', name:'Gauripur',  name_as:'গৌৰীপুৰ',   villages:[v('DBR-2','Gauripur','গৌৰীপুৰ')]},
  ]},
  { code:'SMR', name:'South Salmara-Mankachar', name_as:'দক্ষিণ ছালমাৰা-মানকাচাৰ', circles:[
      { code:'SMR-SLM', name:'South Salmara', name_as:'দক্ষিণ ছালমাৰা', villages:[v('SMR-1','South Salmara','দক্ষিণ ছালমাৰা')]},
      { code:'SMR-MKC', name:'Mankachar',  name_as:'মানকাচাৰ', villages:[v('SMR-2','Mankachar','মানকাচাৰ')]},
  ]},
  { code:'KKR', name:'Kokrajhar', name_as:'কোকৰাঝাৰ', circles:[
      { code:'KKR-KKR', name:'Kokrajhar', name_as:'কোকৰাঝাৰ', villages:[v('KKR-1','Kokrajhar','কোকৰাঝাৰ')]},
      { code:'KKR-GSB', name:'Gossaigaon', name_as:'গোঁসাইগাঁও', villages:[v('KKR-2','Gossaigaon','গোঁসাইগাঁও')]},
  ]},
  { code:'CHG', name:'Chirang',   name_as:'চিৰাং',    circles:[
      { code:'CHG-BJP', name:'Bijni',     name_as:'বিজনী',    villages:[v('CHG-1','Bijni','বিজনী')]},
      { code:'CHG-SDK', name:'Sidli',     name_as:'ছিদলি',    villages:[v('CHG-2','Sidli','ছিদলি')]},
  ]},
  { code:'BNG', name:'Bongaigaon', name_as:'বঙাইগাঁও', circles:[
      { code:'BNG-BNG', name:'Bongaigaon', name_as:'বঙাইগাঁও', villages:[v('BNG-1','Bongaigaon','বঙাইগাঁও')]},
      { code:'BNG-NAL', name:'North Salmara', name_as:'উত্তৰ ছালমাৰা', villages:[v('BNG-2','North Salmara','উত্তৰ ছালমাৰা')]},
  ]},
  { code:'GOA', name:'Goalpara',  name_as:'গোৱালপাৰা', circles:[
      { code:'GOA-GPR', name:'Goalpara',  name_as:'গোৱালপাৰা', villages:[v('GOA-1','Goalpara','গোৱালপাৰা')]},
      { code:'GOA-DUD', name:'Dudhnoi',   name_as:'ধূপধৰা',    villages:[v('GOA-2','Dudhnoi','ধূপধৰা')]},
  ]},
  { code:'TMG', name:'Tamulpur',  name_as:'তামুলপুৰ',   circles:[
      { code:'TMG-TMG', name:'Tamulpur',  name_as:'তামুলপুৰ',   villages:[v('TMG-1','Tamulpur','তামুলপুৰ')]},
      { code:'TMG-GSG', name:'Goreswar',  name_as:'গৰেস্বৰ',    villages:[v('TMG-2','Goreswar','গৰেস্বৰ')]},
  ]},
];

export const findDistrict = (code: string) => districts.find(d => d.code === code);
export const findCircle = (dCode: string, cCode: string) =>
  findDistrict(dCode)?.circles.find(c => c.code === cCode);
