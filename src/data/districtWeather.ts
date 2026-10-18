// Representative coordinates for each district headquarters.
// Used by the weather screen (Open-Meteo requires lat/long, no API key needed).
export type DistrictGeo = { code: string; name: string; name_as: string; lat: number; lon: number };

export const districtGeos: DistrictGeo[] = [
  { code:'GHY', name:'Guwahati',          name_as:'গুৱাহাটী',           lat:26.1445, lon:91.7362 },
  { code:'JHT', name:'Jorhat',            name_as:'জোৰহাট',             lat:26.7509, lon:94.2037 },
  { code:'DBG', name:'Dibrugarh',         name_as:'ডিব্ৰুগড়',            lat:27.4728, lon:94.9120 },
  { code:'TKS', name:'Tinsukia',          name_as:'তিনিচুকীয়া',          lat:27.4922, lon:95.3468 },
  { code:'TZP', name:'Tezpur',            name_as:'তেজপুৰ',             lat:26.6333, lon:92.8000 },
  { code:'SLG', name:'Silchar',           name_as:'শিলচৰ',              lat:24.8333, lon:92.7789 },
  { code:'NGN', name:'Nagaon',            name_as:'নগাঁও',              lat:26.3484, lon:92.6840 },
  { code:'BRP', name:'Barpeta',           name_as:'বৰপেটা',             lat:26.3225, lon:91.0000 },
  { code:'NLB', name:'Nalbari',           name_as:'নলবাৰী',             lat:26.4446, lon:91.4387 },
  { code:'MGD', name:'Mangaldai',         name_as:'মঙলদৈ',              lat:26.4360, lon:92.0330 },
  { code:'DBR', name:'Dhubri',            name_as:'ধুবুৰী',              lat:26.0167, lon:89.9833 },
  { code:'KKR', name:'Kokrajhar',         name_as:'কোকৰাঝাৰ',           lat:26.4000, lon:90.2667 },
  { code:'BNG', name:'Bongaigaon',        name_as:'বঙাইগাঁও',           lat:26.4830, lon:90.5590 },
  { code:'GPR', name:'Goalpara',          name_as:'গোৱালপাৰা',          lat:26.1667, lon:90.6333 },
  { code:'HFL', name:'Haflong',           name_as:'হাফলং',              lat:25.1706, lon:93.0129 },
  { code:'DPR', name:'Diphu',             name_as:'ডিফু',               lat:25.8450, lon:93.4320 },
  { code:'DMJ', name:'Dhemaji',           name_as:'ধেমাজি',             lat:27.4833, lon:94.5833 },
  { code:'MJL', name:'Majuli (Garamur)',  name_as:'মাজুলী',              lat:26.9560, lon:94.1670 },
  { code:'KGJ', name:'Karimganj',         name_as:'কৰিমগঞ্জ',           lat:24.8697, lon:92.3542 },
  { code:'HLK', name:'Hailakandi',        name_as:'হাইলাকান্দি',         lat:24.6900, lon:92.5700 },
];
