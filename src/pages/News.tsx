import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { fetchFeed, feeds, type FeedItem, type FeedKey } from '../services/news';
import { openOfficial } from '../components/OfficialLink';
import { IconNews, IconExternal } from '../components/Icon';

export default function News() {
  const { t, lang } = useI18n();
  const [key, setKey] = useState<FeedKey>('nenow_ne');
  const [items, setItems] = useState<FeedItem[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [err, setErr] = useState<string>('');

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
