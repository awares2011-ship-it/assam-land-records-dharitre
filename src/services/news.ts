// Lightweight RSS fetcher using a public rss-to-json proxy that supports CORS.
// Primary: api.rss2json.com (no key for low volume).
// Each feed below is a verified public RSS endpoint; the UI shows source + date,
// and we never republish full article bodies — only title, snippet and link.

export type FeedKey =
  | 'nenow_ne'
  | 'thehindu_india'
  | 'ie_india'
  | 'ndtv_india'
  | 'ht_india';

export type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
};

type FeedDef = { key: FeedKey; label: string; label_as: string; url: string };

export const feeds: FeedDef[] = [
  { key:'nenow_ne',      label:'North-East (NE Now)',     label_as:'উত্তৰ-পূব (এন ই নাউ)', url:'https://nenow.in/feed' },
  { key:'thehindu_india',label:'India (The Hindu)',       label_as:'ভাৰত (দ্য হিন্দু)',    url:'https://www.thehindu.com/news/national/feeder/default.rss' },
  { key:'ie_india',      label:'India (Indian Express)',  label_as:'ভাৰত (ইণ্ডিয়ান এক্সপ্ৰেছ)', url:'https://indianexpress.com/section/india/feed/' },
  { key:'ndtv_india',    label:'India (NDTV)',            label_as:'ভাৰত (এন ডি টি ভি)',    url:'https://feeds.feedburner.com/ndtvnews-india-news' },
  { key:'ht_india',      label:'India (Hindustan Times)', label_as:'ভাৰত (হিন্দুস্তান টাইমছ)', url:'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml' },
];

const PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

export async function fetchFeed(key: FeedKey): Promise<FeedItem[]> {
  const def = feeds.find(f => f.key === key);
  if (!def) throw new Error('Unknown feed');

  const res = await fetch(PROXY + encodeURIComponent(def.url), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Feed request failed (${res.status})`);

  const data = await res.json();
  if (data.status && data.status !== 'ok') {
    throw new Error(data.message || 'Feed error');
  }
  const items = Array.isArray(data.items) ? data.items : [];
  return items.slice(0, 30).map((it: Record<string, unknown>): FeedItem => ({
    title: String(it.title ?? ''),
    link: String(it.link ?? ''),
    pubDate: String(it.pubDate ?? ''),
    description: stripHtml(String(it.description ?? '')).slice(0, 220),
    source: def.label,
  }));
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}
