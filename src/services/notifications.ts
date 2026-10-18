// Smart multi-colour notification system with lock-screen news.
//
// Rotation (default 3 h):
//   • NEWS    — latest Assam / India headline from RSS                 (blue)
//   • SCHEME  — a random government scheme to explore                  (emerald)
//   • WEATHER — short daily forecast for the saved district            (sky)
//   • PROMO   — in-app feature tip (calculator, Basundhara, PNG/PDF …) (violet)
//
// Dedicated NEWS poller (default 1 h) runs on top of the rotation and
// pushes every unseen headline straight to the lock screen with its own
// Android notification channel. Headlines are deduplicated by article URL.
//
// Platform behaviour
//   • Capacitor Android — uses @capacitor/local-notifications.
//     * Creates four channels on first run, each at IMPORTANCE_HIGH with
//       visibility PUBLIC so they show on the lock screen and the ambient
//       display, and lets Android users toggle each channel in Settings.
//     * iconColor per category paints the small-icon tint.
//     * bigText layout for long article summaries.
//   • Browser / PWA — uses the Web Notification API.
//     * `requireInteraction: true` keeps a news banner on screen until
//       dismissed, which also triggers the lock-screen banner on Android
//       Chrome when installed as a PWA.

import { fetchFeed, type FeedKey } from './news';
import { schemes } from '../data/schemes';
import { fetchWeather, describe } from './weather';
import { districtGeos } from '../data/districtWeather';

export type NotifCategory = 'news' | 'scheme' | 'weather' | 'promo';

export const CATEGORY_META: Record<NotifCategory, {
  label: string;
  color: string;      // iconColor on Android, badge accent on web
  emoji: string;
  channelId: string;  // Android notification channel id
  channelName: string;
}> = {
  news:    { label: 'News',    color: '#3b82f6', emoji: '📰', channelId: 'dharitree_news',    channelName: 'News & headlines' },
  scheme:  { label: 'Scheme',  color: '#10b981', emoji: '🏛️', channelId: 'dharitree_schemes', channelName: 'Government schemes' },
  weather: { label: 'Weather', color: '#0ea5e9', emoji: '🌤️', channelId: 'dharitree_weather', channelName: 'Weather alerts' },
  promo:   { label: 'Tip',     color: '#8b5cf6', emoji: '✨', channelId: 'dharitree_tips',    channelName: 'App tips' },
};

type Prefs = {
  enabled: boolean;
  intervalHours: number;
  categories: Record<NotifCategory, boolean>;
  // Lock-screen news poller
  newsLockScreen: boolean;
  newsIntervalMinutes: number;
  lastShown: Record<NotifCategory, number>;
  seenNewsUrls: string[];        // dedup cache (capped)
  rotation: NotifCategory[];
  rotationIndex: number;
};

const KEY = 'ad.notif.prefs.v1';
const CYCLE_KEY = 'ad.notif.cycle';
const NEWS_CYCLE_KEY = 'ad.notif.news.cycle';
const CHANNELS_CREATED_KEY = 'ad.notif.channels.v1';
const MAX_SEEN = 60;

const DEFAULT_PREFS: Prefs = {
  enabled: false,
  intervalHours: 3,
  categories: { news: true, scheme: true, weather: true, promo: true },
  newsLockScreen: true,
  newsIntervalMinutes: 60,
  lastShown: { news: 0, scheme: 0, weather: 0, promo: 0 },
  seenNewsUrls: [],
  rotation: ['news', 'scheme', 'weather', 'promo'],
  rotationIndex: 0,
};

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Prefs) };
  } catch { /* ignore */ }
  return DEFAULT_PREFS;
}

export function savePrefs(p: Prefs) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

// ---------- Capacitor adapters ----------
type CapRuntime = { isNativePlatform?: () => boolean };
function isNative(): boolean {
  try {
    const w = window as unknown as { Capacitor?: CapRuntime };
    return !!(w.Capacitor && typeof w.Capacitor.isNativePlatform === 'function' && w.Capacitor.isNativePlatform());
  } catch { return false; }
}

type Channel = {
  id: string; name: string; description?: string;
  importance?: 1 | 2 | 3 | 4 | 5;
  visibility?: -1 | 0 | 1;
  lights?: boolean; lightColor?: string;
  vibration?: boolean;
  sound?: string;
};
type LocalNotif = {
  id: number;
  title: string;
  body: string;
  largeBody?: string;
  summaryText?: string;
  smallIcon?: string;
  iconColor?: string;
  channelId?: string;
  extra?: Record<string, unknown>;
  ongoing?: boolean;
};
type LN = {
  requestPermissions(): Promise<{ display: string }>;
  schedule(opts: { notifications: LocalNotif[] }): Promise<unknown>;
  createChannel(c: Channel): Promise<unknown>;
  listChannels?(): Promise<{ channels: Channel[] }>;
  addListener?(ev: string, cb: (x: unknown) => void): Promise<unknown>;
};
async function loadCap(): Promise<{ LocalNotifications: LN }> {
  return (await import('@capacitor/local-notifications')) as unknown as { LocalNotifications: LN };
}

// ---------- One-time channel setup (HIGH importance + PUBLIC lock-screen) ----------
async function ensureChannels(): Promise<void> {
  if (!isNative()) return;
  try {
    if (localStorage.getItem(CHANNELS_CREATED_KEY) === '1') return;
  } catch { /* ignore */ }
  try {
    const { LocalNotifications } = await loadCap();
    for (const cat of Object.keys(CATEGORY_META) as NotifCategory[]) {
      const meta = CATEGORY_META[cat];
      await LocalNotifications.createChannel({
        id: meta.channelId,
        name: meta.channelName,
        description: `${meta.label} notifications from Assam Dharitree`,
        importance: 5,           // IMPORTANCE_HIGH — heads-up + lock screen
        visibility: 1,           // VISIBILITY_PUBLIC — full content on lock screen
        lights: true,
        lightColor: meta.color,
        vibration: cat === 'news', // only news vibrates; others silent
        sound: undefined,
      });
    }
    try { localStorage.setItem(CHANNELS_CREATED_KEY, '1'); } catch { /* ignore */ }
  } catch { /* channel creation is best-effort */ }
}

// ---------- Permission ----------
export async function ensurePermission(): Promise<boolean> {
  if (isNative()) {
    const { LocalNotifications } = await loadCap();
    const res = await LocalNotifications.requestPermissions();
    await ensureChannels();
    return res.display === 'granted';
  }
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied')  return false;
  const r = await Notification.requestPermission();
  return r === 'granted';
}

// ---------- Delivery ----------
type Payload = {
  title: string;
  body: string;
  longBody?: string;              // used as Android `bigText` layout
  category: NotifCategory;
  url?: string;
  tag?: string;                   // dedup tag (web + Android)
  requireInteraction?: boolean;   // keep on screen until user acts (news banners)
};

async function deliver(p: Payload): Promise<void> {
  const meta = CATEGORY_META[p.category];
  if (isNative()) {
    try {
      await ensureChannels();
      const { LocalNotifications } = await loadCap();
      await LocalNotifications.schedule({
        notifications: [{
          id: Math.floor(Math.random() * 2_000_000_000),
          title: `${meta.emoji} ${p.title}`,
          body:  p.body,
          largeBody: p.longBody || p.body,
          summaryText: meta.label,
          smallIcon: 'ic_stat_icon',
          iconColor: meta.color,
          channelId: meta.channelId,
          extra: { url: p.url, category: p.category, tag: p.tag },
        }],
      });
    } catch { /* fail silently on native */ }
    return;
  }
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(`${meta.emoji} ${p.title}`, {
      body: p.longBody || p.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: p.tag ?? p.category,       // replaces earlier notif with the same tag
      data: { url: p.url, color: meta.color, category: p.category },
      requireInteraction: !!p.requireInteraction,
      silent: false,
    });
    n.onclick = () => {
      try { window.focus(); } catch { /* ignore */ }
      if (p.url) try { window.open(p.url, '_blank'); } catch { /* ignore */ }
      n.close();
    };
  } catch { /* ignore */ }
}

// ---------- Content providers ----------
const NEWS_FEEDS: FeedKey[] = ['nenow_ne', 'ie_india', 'ndtv_india', 'thehindu_india'];

async function pickNews(): Promise<Payload | null> {
  for (const key of NEWS_FEEDS) {
    try {
      const items = await fetchFeed(key);
      const top = items[0];
      if (top) {
        return {
          title: top.title.slice(0, 80),
          body:  top.source,
          longBody: top.description.slice(0, 240) || top.title,
          category: 'news',
          url: top.link,
          tag: `news:${top.link}`,
          requireInteraction: true,
        };
      }
    } catch { /* try next */ }
  }
  return null;
}

function pickScheme(): Payload {
  const s = schemes[Math.floor(Math.random() * schemes.length)];
  return {
    title: s.name,
    body: s.description.slice(0, 160),
    longBody: s.description.slice(0, 320),
    category: 'scheme',
    url: `#/schemes/${s.id}`,
    tag: `scheme:${s.id}`,
  };
}

async function pickWeather(): Promise<Payload | null> {
  const code = (() => { try { return localStorage.getItem('ad.wx.district') ?? 'GHY'; } catch { return 'GHY'; } })();
  const geo = districtGeos.find(g => g.code === code) ?? districtGeos[0];
  try {
    const w = await fetchWeather(geo.lat, geo.lon);
    const now = describe(w.current.weatherCode);
    const d0 = w.forecast[0];
    const body = `Rain today ${d0?.rainProb ?? 0}%, ${Math.round(d0?.tMax ?? 0)}°/${Math.round(d0?.tMin ?? 0)}°. Humidity ${w.current.humidity}%.`;
    return {
      title: `${geo.name} · ${Math.round(w.current.temperature)}°C ${now.emoji}`,
      body,
      category: 'weather',
      url: '#/weather',
      tag: `weather:${geo.code}:${new Date().toISOString().slice(0, 10)}`,
    };
  } catch { return null; }
}

const PROMOS: Payload[] = [
  { title: 'Convert bigha → katha instantly', body: 'Try the offline land calculator — Assam-standard factors.', category: 'promo', url: '#/calculator', tag: 'promo:calc' },
  { title: 'Save a Jamabandi as PDF',          body: 'Any search result can be downloaded as PNG or PDF.',          category: 'promo', url: '#/land-search', tag: 'promo:pdf' },
  { title: 'Mission Basundhara at a glance',   body: 'See services, documents and the official link in one tap.',  category: 'promo', url: '#/basundhara',   tag: 'promo:basu' },
  { title: 'Check your e-Khajana steps',       body: 'Step-by-step guide for online land-revenue payment.',        category: 'promo', url: '#/e-khajana',    tag: 'promo:ekha' },
  { title: 'Estimate stamp duty',              body: 'Quick urban/rural stamp duty + registration estimate.',       category: 'promo', url: '#/stamp-duty',   tag: 'promo:stamp' },
  { title: 'EMI calculator',                   body: 'Plan your land / home loan EMI in seconds.',                 category: 'promo', url: '#/emi',          tag: 'promo:emi' },
];
function pickPromo(): Payload { return PROMOS[Math.floor(Math.random() * PROMOS.length)]; }

async function nextPayload(prefs: Prefs): Promise<{ payload: Payload | null; newIdx: number }> {
  const enabled = prefs.rotation.filter(c => prefs.categories[c]);
  if (enabled.length === 0) return { payload: null, newIdx: prefs.rotationIndex };
  for (let i = 0; i < enabled.length; i++) {
    const cat = enabled[(prefs.rotationIndex + i) % enabled.length];
    const payload =
      cat === 'news'    ? await pickNews()    :
      cat === 'scheme'  ? pickScheme()        :
      cat === 'weather' ? await pickWeather() :
                          pickPromo();
    if (payload) return { payload, newIdx: (prefs.rotationIndex + i + 1) % enabled.length };
  }
  return { payload: null, newIdx: prefs.rotationIndex };
}

// ---------- Rotation scheduler ----------
let rotationTimer: number | undefined;
let newsTimer: number | undefined;

export async function enable(): Promise<boolean> {
  const ok = await ensurePermission();
  if (!ok) return false;
  const prefs = { ...loadPrefs(), enabled: true };
  savePrefs(prefs);
  await ensureChannels();
  start();
  await tickRotation(true);
  await tickNews(true);
  return true;
}

export function disable(): void {
  savePrefs({ ...loadPrefs(), enabled: false });
  stop();
}

export function start(): void {
  stop();
  const prefs = loadPrefs();
  if (!prefs.enabled) return;
  const rotMs  = Math.max(5 * 60_000, prefs.intervalHours * 60 * 60_000);
  rotationTimer = window.setInterval(() => { void tickRotation(false); }, rotMs);
  if (prefs.newsLockScreen && prefs.categories.news) {
    const newsMs = Math.max(5 * 60_000, prefs.newsIntervalMinutes * 60_000);
    newsTimer = window.setInterval(() => { void tickNews(false); }, newsMs);
  }
  scheduleFromLast();
}

export function stop(): void {
  if (rotationTimer !== undefined) window.clearInterval(rotationTimer);
  if (newsTimer     !== undefined) window.clearInterval(newsTimer);
  rotationTimer = undefined;
  newsTimer = undefined;
}

function scheduleFromLast(): void {
  const prefs = loadPrefs();
  if (!prefs.enabled) return;
  let last = 0, lastNews = 0;
  try { last     = Number(localStorage.getItem(CYCLE_KEY)      ?? '0'); } catch { /* ignore */ }
  try { lastNews = Number(localStorage.getItem(NEWS_CYCLE_KEY) ?? '0'); } catch { /* ignore */ }
  const rotMs = Math.max(5 * 60_000, prefs.intervalHours * 60 * 60_000);
  const dueIn = Math.max(0, last + rotMs - Date.now());
  if (dueIn <= 10_000) void tickRotation(false);
  else window.setTimeout(() => { void tickRotation(false); }, dueIn);

  if (prefs.newsLockScreen && prefs.categories.news) {
    const nMs = Math.max(5 * 60_000, prefs.newsIntervalMinutes * 60_000);
    const dueN = Math.max(0, lastNews + nMs - Date.now());
    if (dueN <= 10_000) void tickNews(false);
    else window.setTimeout(() => { void tickNews(false); }, dueN);
  }
}

async function tickRotation(force: boolean): Promise<void> {
  const prefs = loadPrefs();
  if (!prefs.enabled && !force) return;
  const { payload, newIdx } = await nextPayload(prefs);
  if (!payload) return;
  await deliver(payload);
  savePrefs({
    ...prefs,
    rotationIndex: newIdx,
    lastShown: { ...prefs.lastShown, [payload.category]: Date.now() },
  });
  try { localStorage.setItem(CYCLE_KEY, String(Date.now())); } catch { /* ignore */ }
}

// ---------- Lock-screen news poller ----------
async function tickNews(force: boolean): Promise<void> {
  const prefs = loadPrefs();
  if (!force && (!prefs.enabled || !prefs.newsLockScreen || !prefs.categories.news)) return;
  const items = await collectFreshNews(prefs);
  if (!items.length) return;

  // Push up to 3 unseen headlines per tick (one per feed, newest first)
  const seen = new Set(prefs.seenNewsUrls);
  const toSend: Payload[] = [];
  for (const it of items) {
    if (seen.has(it.url ?? '')) continue;
    toSend.push(it);
    if (it.url) seen.add(it.url);
    if (toSend.length >= 3) break;
  }
  for (const p of toSend) await deliver(p);

  const seenArr = Array.from(seen).slice(-MAX_SEEN);
  savePrefs({ ...prefs, seenNewsUrls: seenArr, lastShown: { ...prefs.lastShown, news: Date.now() } });
  try { localStorage.setItem(NEWS_CYCLE_KEY, String(Date.now())); } catch { /* ignore */ }
}

async function collectFreshNews(_prefs: Prefs): Promise<Payload[]> {
  const out: Payload[] = [];
  for (const key of NEWS_FEEDS) {
    try {
      const items = await fetchFeed(key);
      for (const it of items.slice(0, 3)) {
        out.push({
          title: it.title.slice(0, 80),
          body:  it.source,
          longBody: it.description.slice(0, 240) || it.title,
          category: 'news',
          url: it.link,
          tag: `news:${it.link}`,
          requireInteraction: true,
        });
      }
    } catch { /* skip bad feed */ }
  }
  return out;
}

export async function sendTest(): Promise<void> {
  await deliver({
    title: 'Notifications are on 🎉',
    body: 'News, schemes, weather & tips — right on your lock screen.',
    longBody: 'You can turn each category off separately. News headlines come straight from Assam, NDTV, The Hindu and Indian Express.',
    category: 'promo',
    url: '#/notifications',
    tag: 'test',
  });
}

export async function sendNewsNow(): Promise<boolean> {
  const prefs = loadPrefs();
  const items = await collectFreshNews(prefs);
  const fresh = items.find(i => !prefs.seenNewsUrls.includes(i.url ?? ''));
  const payload = fresh ?? items[0];
  if (!payload) return false;
  await deliver(payload);
  if (payload.url) {
    const seen = Array.from(new Set([...prefs.seenNewsUrls, payload.url])).slice(-MAX_SEEN);
    savePrefs({ ...prefs, seenNewsUrls: seen, lastShown: { ...prefs.lastShown, news: Date.now() } });
  }
  return true;
}
