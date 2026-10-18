import { useEffect, useRef, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { fetchFeed, feeds, type FeedItem, type FeedKey } from '../services/news';
import { openOfficial } from '../components/OfficialLink';
import { IconNews, IconExternal } from '../components/Icon';
import { AD_UNITS, isNativePlatform, NativeAdFeed, NativeAdTemplate } from '../services/ads';
import { NativeAdPluginEvents } from '@capacitor-community/admob';

type NativeSlotState = 'hidden' | 'visible' | 'failed';

export default function News() {
  const { t, lang } = useI18n();
  const [key, setKey] = useState<FeedKey>('nenow_ne');
  const [items, setItems] = useState<FeedItem[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [err, setErr] = useState<string>('');
  const [nativeSlot, setNativeSlot] = useState<NativeSlotState>('hidden');
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setState('loading');
    setErr('');
    fetchFeed(key)
      .then((xs) => { if (active) { setItems(xs); setState('ok'); } })
      .catch((e: unknown) => {
        if (!active) return;
        setErr(e instanceof Error ? e.message : 'Error');
        setState('error');
      });
    return () => { active = false; };
  }, [key]);

  useEffect(() => {
    if (!isNativePlatform()) return;
    const slot = slotRef.current;
    if (!slot) return;

    let feed: NativeAdFeed | undefined;
    let cancelled = false;
    let slotFailed = false;
    let slotLoaded = false;
    const failTimer = window.setTimeout(() => {
      if (!cancelled && !slotLoaded && !slotFailed) {
        slotFailed = true;
        setNativeSlot('failed');
      }
    }, 15_000);

    NativeAdFeed.create({
      feedId: 'news-native-feed',
      adId: AD_UNITS.native,
      template: NativeAdTemplate.Small,
      isTesting: import.meta.env.DEV,
    })
      .then(async (f) => {
        if (cancelled) {
          await f.destroy().catch(() => undefined);
          return;
        }
        feed = f;
        await f.addListener(NativeAdPluginEvents.Loaded, () => {
          if (!cancelled && !slotFailed) {
            slotLoaded = true;
            setNativeSlot('visible');
          }
        }).catch(() => undefined);
        await f.addListener(NativeAdPluginEvents.FailedToLoad, () => {
          if (!cancelled) {
            slotFailed = true;
            setNativeSlot('failed');
          }
        }).catch(() => undefined);
        f.attach('news-1', slot);
      })
      .catch(() => {
        if (!cancelled) {
          slotFailed = true;
          setNativeSlot('failed');
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(failTimer);
      if (feed) {
        try { feed.detach(slot); } catch { /* already detached */ }
        void feed.destroy().catch(() => undefined);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('news.title')}
        subtitle={t('news.local')}
        icon={<IconNews className="w-5 h-5" />}
      />

      <section className="m3-card p-3">
        <label className="label" htmlFor="feed">{t('news.by_source')}</label>
        <select id="feed" value={key} onChange={(e) => setKey(e.target.value as FeedKey)} className="input">
          {feeds.map(f => (
            <option key={f.key} value={f.key}>{lang === 'as' ? f.label_as : f.label}</option>
          ))}
        </select>
      </section>

      {/* Sponsored native ad slot — collapsed until the SDK reports a fill. */}
      <div
        ref={slotRef}
        aria-hidden={nativeSlot !== 'visible'}
        className="m3-card overflow-hidden"
        style={{
          height: nativeSlot === 'failed' ? 0 : 118,
          opacity: nativeSlot === 'visible' ? 1 : 0,
          transition: 'opacity 250ms ease',
          padding: 0,
          border: nativeSlot === 'visible' ? undefined : 'none',
        }}
      />

      {state === 'loading' && (
        <div className="m3-card p-5 text-sm text-slate-500">{t('common.loading')}</div>
      )}
      {state === 'error' && (
        <div className="m3-card p-5 text-sm text-rose-700 bg-rose-50 border-rose-100">
          {t('common.error')} — {err}
        </div>
      )}
      {state === 'ok' && items.length === 0 && (
        <div className="m3-card p-5 text-sm text-slate-500 text-center">{t('common.empty')}</div>
      )}

      <ul className="space-y-2.5">
        {items.map((it) => {
          const dt = new Date(it.pubDate);
          const dateStr = isNaN(dt.getTime()) ? it.pubDate : dt.toLocaleString();
          return (
            <li key={it.link} className="m3-card p-4">
              <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">{it.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{it.source} • {dateStr}</p>
              {it.description ? (
                <p className="text-sm text-slate-700 mt-2 line-clamp-3">{it.description}</p>
              ) : null}
              <button
                type="button"
                onClick={() => openOfficial(it.link)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700"
              >
                <IconExternal className="w-4 h-4" />
                {t('news.open_article')}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
