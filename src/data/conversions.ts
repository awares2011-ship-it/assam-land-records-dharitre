// Assam-specific land unit conversions.
// Standard definitions used by the Directorate of Land Records, Assam:
//   1 bigha = 5 katha = 100 lecha = 14,400 sq ft ≈ 1,337.80 sq m ≈ 0.3306 acre
//
// Internally we store every unit in SQUARE METRES and convert from there.
// Every factor below is "square metres per 1 unit".

export type Unit =
  | 'sqm'
  | 'sqft'
  | 'bigha'
  | 'katha'
  | 'lecha'
  | 'acre'
  | 'hectare';

export const SQM_PER: Record<Unit, number> = {
  sqm:     1,
  sqft:    0.09290304,              // exact: 1 ft = 0.3048 m
  // Assam-standard bigha
  bigha:   1337.8033536,            // 14,400 sq ft * 0.09290304
  katha:   267.56067072,            // 1 bigha / 5
  lecha:   13.378033536,            // 1 bigha / 100
  acre:    4046.8564224,            // exact
  hectare: 10000,
};

export const unitLabels: Record<Unit, { en: string; as: string; hi: string }> = {
  sqm:     { en:'Square metres',  as:'বৰ্গ মিটাৰ', hi:'वर्ग मीटर' },
  sqft:    { en:'Square feet',    as:'বৰ্গ ফুট',  hi:'वर्ग फ़ुट' },
  bigha:   { en:'Bigha',          as:'বিঘা',      hi:'बीघा' },
  katha:   { en:'Katha',          as:'কঠা',       hi:'कठ्ठा' },
  lecha:   { en:'Lecha',          as:'লেছা',       hi:'लेछा' },
  acre:    { en:'Acre',           as:'একৰ',       hi:'एकड़' },
  hectare: { en:'Hectare',        as:'হেক্টৰ',    hi:'हेक्टेयर' },
};

export const allUnits: Unit[] = ['bigha', 'katha', 'lecha', 'acre', 'hectare', 'sqm', 'sqft'];

export function convert(value: number, from: Unit, to: Unit): number {
  if (!isFinite(value) || isNaN(value)) return 0;
  const sqm = value * SQM_PER[from];
  return sqm / SQM_PER[to];
}

export function formatNum(x: number): string {
  if (!isFinite(x)) return '—';
  const abs = Math.abs(x);
  const digits = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  return x.toLocaleString(undefined, { maximumFractionDigits: digits });
}
