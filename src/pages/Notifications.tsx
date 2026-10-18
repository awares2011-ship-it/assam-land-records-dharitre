import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { pick, type Lang } from '../i18n/translations';
import {
  CATEGORY_META, disable, enable, loadPrefs, savePrefs, sendTest, sendNewsNow, start,
  type NotifCategory,
} from '../services/notifications';
import { IconInfo } from '../components/Icon';

export default function NotificationsPage() {
  const { lang } = useI18n();
  const [prefs, setPrefs] = useState(() => loadPrefs());
  const [busy, setBusy] = useState(false);
  const [perm, setPerm] = useState<string>(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'default');

  useEffect(() => {
    const i = window.setInterval(() => {
      if (typeof Notification !== 'undefined') setPerm(Notification.permission);
    }, 1000);
    return () => window.clearInterval(i);
  }, []);

  const toggleEnable = async () => {
    setBusy(true);
    try {
      if (prefs.enabled) {
        disable();
        setPrefs(loadPrefs());
      } else {
        const ok = await enable();
        if (!ok) {
          alert(lang === 'as'
            ? 'নটিফিকেচন অনুমতি দিয়া নাই।'
            : 'Notification permission was not granted.');
        }
        setPrefs(loadPrefs());
      }
    } finally { setBusy(false); }
  };

  const toggleCategory = (c: NotifCategory) => {
    const next = { ...prefs, categories: { ...prefs.categories, [c]: !prefs.categories[c] } };
    savePrefs(next);
    setPrefs(next);
  };

  const setInterval = (h: number) => {
    const next = { ...prefs, intervalHours: h };
    savePrefs(next);
    setPrefs(next);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={pick(lang, 'Smart notifications', 'স্মাৰ্ট নটিফিকেচন', 'स्मार्ट नोटिफिकेशन')}
        subtitle={pick(lang, 'News · Schemes · Weather · Tips', 'ঘণ্টামতে বাতৰি, আঁচনি, বতৰ আৰু টিপচ্‌', 'समाचार · योजनाएँ · मौसम · सुझाव')}
      />

      {/* Enable / disable */}
      <section className="m3-card p-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {pick(lang, 'Enable notifications', 'নটিফিকেচন চালু', 'नोटिफिकेशन चालू करें')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {pick(lang,
              `One reminder every ${prefs.intervalHours} hours.`,
              `প্ৰতি ${prefs.intervalHours} ঘণ্টাত একোটা ৰিমাইণ্ডাৰ।`,
              `हर ${prefs.intervalHours} घंटे में एक रिमाइंडर।`)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {pick(lang, 'Permission', 'অনুমতিৰ অৱস্থা', 'अनुमति')}: <b>{perm}</b>
          </p>
        </div>
        <Switch on={prefs.enabled} onChange={toggleEnable} disabled={busy} />
      </section>

      {/* Interval chooser */}
      <section className="m3-card p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          {pick(lang, 'Interval', 'অৱধি', 'अंतराल')}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[1, 3, 6, 12].map(h => (
            <button
              key={h}
              onClick={() => setInterval(h)}
              className={
                'rounded-xl py-2 text-sm font-medium border transition ' +
                (prefs.intervalHours === h
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-700 border-slate-200')
              }
            >
              {h}h
            </button>
          ))}
        </div>
      </section>

      {/* Category toggles with colour swatches */}
      <section className="m3-card p-2">
        <h3 className="text-sm font-semibold text-slate-900 px-2 pt-2">
          {pick(lang, 'Categories', 'শ্ৰেণী', 'श्रेणियाँ')}
        </h3>
        <ul className="mt-1 divide-y divide-slate-100">
          {(Object.keys(CATEGORY_META) as NotifCategory[]).map(c => {
            const meta = CATEGORY_META[c];
            return (
              <li key={c} className="flex items-center gap-3 px-2 py-2.5">
                <span
                  className="w-10 h-10 rounded-2xl grid place-items-center text-white text-lg"
                  style={{ backgroundColor: meta.color }}
                  aria-hidden
                >
                  {meta.emoji}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">
                    {localise(c, meta.label, lang)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {helpFor(c, lang)}
                  </div>
                </div>
                <Switch
                  on={prefs.categories[c]}
                  onChange={() => toggleCategory(c)}
                />
              </li>
            );
          })}
        </ul>
      </section>

      {/* Lock-screen news booster — dedicated poller + its own channel */}
      <section className="m3-card p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span
            className="w-10 h-10 rounded-2xl grid place-items-center text-white text-lg shrink-0"
            style={{ backgroundColor: CATEGORY_META.news.color }}
            aria-hidden
          >
            🔒
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">
              {pick(lang, 'News on lock screen', 'লক-স্ক্ৰীনত বাতৰি', 'लॉक स्क्रीन पर समाचार')}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {pick(lang,
                'Fresh headlines appear on your phone\'s lock screen automatically.',
                'নতুন বাতৰিৰ শিৰোনাম স্বয়ংক্ৰিয়ভাৱে ফোনৰ লক স্ক্ৰীনত দেখুৱাই দিব।',
                'ताज़ा समाचार अपने आप आपके फ़ोन की लॉक स्क्रीन पर आएँगे।')}
            </p>
          </div>
          <Switch
            on={prefs.newsLockScreen}
            onChange={() => {
              const next = { ...prefs, newsLockScreen: !prefs.newsLockScreen };
              savePrefs(next); setPrefs(next); start();
            }}
          />
        </div>

        {prefs.newsLockScreen && (
          <>
            <div>
              <div className="text-xs font-medium text-slate-600 mb-1.5">
                {pick(lang, 'How often to check', 'কিমান সঘনাই চাব', 'कितनी बार जाँचें')}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 60, 180].map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      const next = { ...prefs, newsIntervalMinutes: m };
                      savePrefs(next); setPrefs(next); start();
                    }}
                    className={
                      'rounded-xl py-2 text-xs font-semibold border transition ' +
                      (prefs.newsIntervalMinutes === m
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200')
                    }
                  >
                    {m < 60 ? `${m}m` : `${m / 60}h`}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const ok = await sendNewsNow();
                if (!ok) alert(pick(lang, 'No fresh news found.', 'কোনো নতুন বাতৰি নাই।', 'कोई नया समाचार नहीं मिला।'));
              }}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              📰
              {pick(lang, 'Send a headline now', 'এতিয়াই এটা শিৰোনাম পঠাওক', 'अभी एक हेडलाइन भेजें')}
            </button>
          </>
        )}
      </section>

      <button
        type="button"
        onClick={() => void sendTest()}
        className="btn-ghost w-full"
      >
        {pick(lang, 'Send a test notification', 'এটা পৰীক্ষা নটিফিকেচন পঠিয়াওক', 'एक टेस्ট नोटिफिकेशन भेजें')}
      </button>

      <section className="m3-card p-3 flex items-start gap-2 bg-sky-50 border-sky-100">
        <IconInfo className="w-5 h-5 text-sky-700 shrink-0 mt-0.5"/>
        <p className="text-xs text-sky-900 leading-relaxed">
          {pick(lang,
            'Notifications run locally on your device — nothing is uploaded.',
            'এই নটিফিকেচন কেৱল আপোনাৰ ডিভাইচৰ ভিতৰতে চলে — কোনো তথ্য ক\'ৰবাত আপল\'ড নহয়।',
            'ये नोटिफिकेशन सिर्फ़ आपके डिवाइस पर चलते हैं — कुछ भी अपलोड नहीं होता।')}
        </p>
      </section>
    </div>
  );
}

function localise(c: NotifCategory, label: string, lang: Lang) {
  if (lang === 'en') return label;
  const as = { news: 'বাতৰি', scheme: 'আঁচনি', weather: 'বতৰ', promo: 'টিপচ্‌' } as const;
  const hi = { news: 'समाचार', scheme: 'योजना', weather: 'मौसम', promo: 'सुझाव' } as const;
  return (lang === 'hi' ? hi : as)[c];
}
function helpFor(c: NotifCategory, lang: Lang) {
  const en = { news: 'Latest Assam & India headlines', scheme: 'A government scheme to explore',
               weather: 'Short daily forecast for your district', promo: 'A handy in-app tip or tool' } as const;
  const as = { news: 'অসম আৰু ভাৰতৰ শেহতীয়া বাতৰি', scheme: 'এটা চৰকাৰী আঁচনিৰ পৰিচয়',
               weather: 'আপোনাৰ জিলাৰ বতৰ', promo: 'এটা কামৰ টিপচ্‌' } as const;
  const hi = { news: 'ताज़ा असम और भारत समाचार', scheme: 'एक सरकारी योजना की जानकारी',
               weather: 'आपके ज़िले का संक्षिप्त पूर्वानुमान', promo: 'एक काम का सुझाव' } as const;
  return (lang === 'hi' ? hi : lang === 'as' ? as : en)[c];
}

function Switch({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onChange}
      className={
        'relative w-12 h-7 rounded-full transition shadow-inner ' +
        (on ? 'bg-brand-600' : 'bg-slate-300') +
        (disabled ? ' opacity-60 cursor-not-allowed' : '')
      }
    >
      <span
        className={
          'absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ' +
          (on ? 'translate-x-5' : '')
        }
      />
    </button>
  );
}
