import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { pick } from '../i18n/translations';
import {
  IconSearch, IconDoc, IconLayers, IconMap, IconScheme, IconCalc,
  IconWeather, IconDownload, IconBolt, IconShare, IconStar,
} from '../components/Icon';
import AppLogo from '../components/AppLogo';
import { fetchWeather, describe } from '../services/weather';
import { districtGeos } from '../data/districtWeather';

const RATE_KEY = 'ad.rated.v1';
const ONBOARD_KEY = 'ad.onboarded.v1';

export default function Home() {
  const { t, lang } = useI18n();
  const [weather, setWeather] = useState<{ temp: number; emoji: string; district: string; district_as: string } | null>(null);
  const [showRate, setShowRate] = useState(() => {
    try { return localStorage.getItem(RATE_KEY) !== '1'; } catch { return false; }
  });
  const [showOnboard, setShowOnboard] = useState(() => {
    try { return localStorage.getItem(ONBOARD_KEY) !== '1'; } catch { return false; }
  });

  useEffect(() => {
    let active = true;
    const code = (() => { try { return localStorage.getItem('ad.wx.district') ?? 'GHY'; } catch { return 'GHY'; } })();
    const geo = districtGeos.find(g => g.code === code) ?? districtGeos[0];
    fetchWeather(geo.lat, geo.lon)
      .then(w => {
        if (!active) return;
        setWeather({
          temp: Math.round(w.current.temperature),
          emoji: describe(w.current.weatherCode).emoji,
          district: geo.name, district_as: geo.name_as,
        });
      })
      .catch(() => { /* ignore */ });
    return () => { active = false; };
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (lang === 'as') return h < 12 ? 'à¦¶à§à¦­ à§°à¦¾à¦¤à¦¿à¦ªà§à§±à¦¾' : h < 17 ? 'à¦¶à§à¦­ à¦¦à§à¦ªà§°à§€à¦¯à¦¼à¦¾' : 'à¦¶à§à¦­ à¦¸à¦¨à§à¦§à¦¿à¦¯à¦¼à¦¾';
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }, [lang]);

  const share = async () => {
    const data: ShareData = {
      title: pick(lang, 'Assam Dharitree App', 'à¦…à¦¸à¦® à¦§à§°à¦¿à¦¤à§à§°à§€ à¦à¦ª', 'à¤…à¤¸à¤® à¤§à¤°à¤¿à¤¤à¥à¤°à¥€ à¤à¤ª'),
      text:  pick(lang,
        'Instantly look up Assam land records, Jamabandi and government schemes â€” right from your phone.',
        'à¦…à¦¸à¦®à§° à¦¯à¦¿à¦•à§‹à¦¨à§‹ à¦­à§‚à¦®à¦¿à§° à¦œà¦®à¦¾à¦¬à¦¨à§à¦¦à§€ à¦†à§°à§ à¦…à¦¨à§à¦¯à¦¾à¦¨à§à¦¯ à¦¤à¦¥à§à¦¯ à¦à¦Ÿà¦¾ à¦¤à¦¾à¦ªà¦¤à§‡à¦‡ à¦šà¦¾à¦“à¦•à¥¤',
        'à¤…à¤¸à¤® à¤•à¤¾ à¤•à¥‹à¤ˆ à¤­à¥€ à¤­à¥‚à¤®à¤¿ à¤…à¤­à¤¿à¤²à¥‡à¤–, à¤œà¤®à¤¾à¤¬à¤‚à¤¦à¥€ à¤”à¤° à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤¯à¥‹à¤œà¤¨à¤¾à¤à¤ â€” à¤à¤• à¤Ÿà¥ˆà¤ª à¤®à¥‡à¤‚à¥¤',
      ),
      url: 'https://dharitree.app/',
    };
    try {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (nav.share) { await nav.share(data); return; }
      await navigator.clipboard.writeText(`${data.text} ${data.url}`);
      alert(pick(lang, 'Link copied to clipboard!', 'à¦²à¦¿à¦‚à¦• à¦•à¦ªà¦¿ à¦¹\'à¦²!', 'à¤²à¤¿à¤‚à¤• à¤•à¥‰à¤ªà¥€ à¤¹à¥‹ à¤—à¤¯à¤¾!'));
    } catch { /* cancelled */ }
  };

  const dismissRate = () => {
    try { localStorage.setItem(RATE_KEY, '1'); } catch { /* ignore */ }
    setShowRate(false);
  };

  if (showOnboard) {
    return (
      <Onboarding
        onDone={() => {
          try { localStorage.setItem(ONBOARD_KEY, '1'); } catch { /* ignore */ }
          setShowOnboard(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* â”€â”€â”€â”€â”€ TRUST-FORWARD HERO â€” violet â†’ magenta â†’ blue, mirrors the logo â”€â”€â”€â”€â”€ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-magenta-500 to-blue-600 text-white p-5 shadow-pop">
        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10"/>
        <div className="absolute -left-10 -bottom-20 w-48 h-48 rounded-full bg-white/5"/>

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-white/15 backdrop-blur text-white rounded-full px-2.5 py-1 mb-2">
              <IconShield className="w-3 h-3"/>
              {pick(lang, 'Live from Government Dharitree ILRMS', 'à¦šà§°à¦•à¦¾à§°à§€ à¦§à§°à¦¿à¦¤à§à§°à§€ ILRMS à§° à¦ªà§°à¦¾', 'à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤§à¤°à¤¿à¤¤à¥à¤°à¥€ ILRMS à¤¸à¥‡ à¤²à¤¾à¤‡à¤µ')}
            </div>
            <p className="text-xs text-brand-100">{greeting} ðŸ‘‹</p>
            <h1 className="text-[26px] font-extrabold leading-[1.1] mt-1 tracking-tight">
              {pick(lang, 'Your Land Records', 'à¦…à¦¸à¦® à¦­à§‚à¦®à¦¿ à¦…à¦­à¦¿à¦²à§‡à¦–', 'à¤…à¤¸à¤® à¤­à¥‚à¤®à¤¿ à¤…à¤­à¤¿à¤²à¥‡à¤–')}
            </h1>
            <p className="text-xs text-brand-100 mt-1 max-w-[16rem]">
              {pick(lang, 'Jamabandi Â· Mutation Â· e-Khajana â€” in 60 seconds', 'à¦œà¦®à¦¾à¦¬à¦¨à§à¦¦à§€, à¦¨à¦¾à¦®à¦œà¦¾à§°à¦¿, à¦‡-à¦–à¦¾à¦œà¦¨à¦¾ â€” à§¬à§¦ à¦›à§‡à¦•à§‡à¦£à§à¦¡à¦¤', 'à¤œà¤®à¤¾à¤¬à¤‚à¤¦à¥€ Â· à¤¨à¤¾à¤®à¤¾à¤‚à¤¤à¤°à¤£ Â· à¤ˆ-à¤–à¤œà¤¾à¤¨à¤¾ â€” 60 à¤¸à¥‡à¤•à¤‚à¤¡ à¤®à¥‡à¤‚')}
            </p>
          </div>
          {weather && (
            <Link
              to="/weather"
              className="shrink-0 bg-white/15 rounded-2xl px-3 py-2 text-center backdrop-blur active:scale-[0.98]"
              aria-label="Weather"
            >
              <div className="text-2xl leading-none">{weather.emoji}</div>
              <div className="text-base font-semibold leading-none mt-1">{weather.temp}Â°</div>
              <div className="text-[10px] text-brand-100 mt-0.5 truncate max-w-[70px]">
                {lang === 'en' ? weather.district : weather.district_as}
              </div>
            </Link>
          )}
        </div>

        {/* HERO CTA */}
        <Link
          to="/land-search"
          className="relative mt-5 flex items-center gap-3 rounded-2xl bg-white text-slate-900 p-4 shadow-pop active:scale-[0.99]"
        >
          <div className="relative w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-brand-600 to-magenta-600 text-white grid place-items-center">
            <IconSearch className="w-6 h-6"/>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-500 border-2 border-white animate-pulse" aria-hidden/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold leading-tight">
              {pick(lang, 'Search Land Record', 'à¦­à§‚à¦®à¦¿ à¦…à¦­à¦¿à¦²à§‡à¦– à¦¸à¦¨à§à¦§à¦¾à¦¨', 'à¤­à¥‚à¤®à¤¿ à¤…à¤­à¤¿à¤²à¥‡à¤– à¤–à¥‹à¤œà¥‡à¤‚')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {pick(lang, 'District â†’ Circle â†’ Village â†’ Dag no', 'à¦œà¦¿à¦²à¦¾ â†’ à¦šà¦•à§à§° â†’ à¦—à¦¾à¦à¦“ â†’ à¦¦à¦¾à¦— à¦¨à¦‚', 'à¤œà¤¼à¤¿à¤²à¤¾ â†’ à¤¸à¤°à¥à¤•à¤² â†’ à¤—à¤¾à¤à¤µ â†’ à¤¦à¤¾à¤— à¤¨à¤‚')}
            </div>
          </div>
          <span className="text-brand-700 text-xl font-bold">â€º</span>
        </Link>

        {/* Trust strip inside hero */}
        <div className="relative mt-3 grid grid-cols-3 gap-2 text-center text-white">
          <Stat n={pick(lang, '30+', 'à§©à§¦+', '30+')}       l={pick(lang, 'Districts', 'à¦œà¦¿à¦²à¦¾', 'à¤œà¤¼à¤¿à¤²à¥‡')} />
          <Stat n={pick(lang, '100%', 'à§§à§¦à§¦%', '100%')}     l={pick(lang, 'Official', 'à¦šà§°à¦•à¦¾à§°à§€', 'à¤¸à¤°à¤•à¤¾à¤°à¥€')} />
          <Stat n={pick(lang, 'Free', 'à¦¨à¦¿à¦ƒà¦¶à§à¦²à§à¦•', 'à¤®à¥à¤«à¤¼à¥à¤¤')} l={pick(lang, 'Forever', 'à¦¸à¦¦à¦¾à¦¯à¦¼', 'à¤¹à¤®à¥‡à¤¶à¤¾')} />
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€ FEATURE PREVIEW â€” "What you get" â”€â”€â”€â”€â”€ */}
      <section className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            {pick(lang, "What you'll get", 'à¦†à¦ªà§à¦¨à¦¿ à¦•à¦¿ à¦ªà¦¾à¦¬', 'à¤†à¤ªà¤•à¥‹ à¤•à¥à¤¯à¤¾ à¤®à¤¿à¤²à¥‡à¤—à¤¾')}
          </h2>
          <Link to="/land-search" className="text-brand-700 text-[11px] font-semibold">
            {pick(lang, 'Try now â†’', 'à¦à¦¤à¦¿à¦¯à¦¼à¦¾à¦‡ à¦šà§‡à¦·à§à¦Ÿà¦¾ à¦•à§°à¦• â†’', 'à¤…à¤­à¥€ à¤†à¤œà¤¼à¤®à¤¾à¤à¤ â†’')}
          </Link>
        </div>
        <div className="px-4 pb-4">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-3 py-2 bg-gradient-to-r from-brand-50 to-pink-50 border-b border-slate-100 flex items-center gap-2">
              <IconDoc className="w-4 h-4 text-brand-700"/>
              <span className="text-[12px] font-semibold text-brand-900">
                {pick(lang, 'Jamabandi for Surveyed Village', 'à¦œà§°à§€à¦ª à¦¹à§‹à§±à¦¾ à¦—à¦¾à¦à§±à§° à¦œà¦®à¦¾à¦¬à¦¨à§à¦¦à§€', 'à¤¸à¤°à¥à¤µà¥‡à¤•à¥à¤·à¤¿à¤¤ à¤—à¤¾à¤à¤µ à¤•à¥€ à¤œà¤®à¤¾à¤¬à¤‚à¤¦à¥€')}
              </span>
              <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-brand-700 bg-white/70 rounded px-1.5 py-0.5">
                live
              </span>
            </div>
            <div className="p-3 text-[11px] text-slate-700 space-y-1">
              <SampleRow k={pick(lang, 'District',   'à¦œà¦¿à¦²à¦¾',       'à¤œà¤¼à¤¿à¤²à¤¾')}      v="à¦¬à§°à¦ªà§‡à¦Ÿà¦¾"/>
              <SampleRow k={pick(lang, 'Circle',     'à¦šà¦•à§à§°',       'à¤¸à¤°à¥à¤•à¤²')}     v="à¦¬à§°à¦¨à¦—à§°"/>
              <SampleRow k={pick(lang, 'Village',    'à¦—à¦¾à¦à¦“',       'à¤—à¤¾à¤à¤µ')}      v="à§°à¦¾à¦®à¦ªà§à§°"/>
              <SampleRow k={pick(lang, 'Patta type', 'à¦ªà¦Ÿà§à¦Ÿà¦¾à§° à¦§à§°à¦£', 'à¤ªà¤Ÿà¥à¤Ÿà¤¾ à¤ªà¥à¤°à¤•à¤¾à¤°')} v="à¦®à§à¦¯à¦¾à¦¦à§€"/>
              <SampleRow k={pick(lang, 'Pattadar',   'à¦ªà¦Ÿà§à¦Ÿà¦¾à¦¦à¦¾à§°',   'à¤ªà¤Ÿà¥à¤Ÿà¥‡à¤¦à¤¾à¤°')}   v="à¦¶à§à§°à§€ à¦šà¦¾à¦¨à§‹à§°à¦¾à¦® à¦¦à¦¾à¦¸ â€¦"/>
            </div>
            <div className="px-3 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2 text-[10px] text-slate-500">
              <IconDownload className="w-3.5 h-3.5 text-brand-700"/>
              <span>{pick(lang, 'Downloadable as PNG & PDF', 'PNG à¦†à§°à§ PDF à¦¹à¦¿à¦šà¦¾à¦ªà§‡ à¦¡à¦¾à¦‰à¦¨à¦²\'à¦¡', 'PNG à¤”à¤° PDF à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤¡à¤¾à¤‰à¤¨à¤²à¥‹à¤¡')}</span>
              <span className="ml-auto">ilrms.assam.gov.in</span>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€ SERVICES â€” compact 2Ã—3 â”€â”€â”€â”€â”€ */}
      <section>
        <h2 className="px-1 mb-2 text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
          <IconBolt className="w-3.5 h-3.5 text-accent-500"/>
          {pick(lang, 'More services', 'à¦†à§°à§ à¦­à§‚à¦®à¦¿ à¦¸à§‡à§±à¦¾', 'à¤”à¤° à¤¸à¥‡à¤µà¤¾à¤à¤')}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <Service to="/jamabandi" bg="bg-brand-100 text-brand-700"     title={t('svc.jamabandi')}  />
          <Service to="/mutation"  bg="bg-fuchsia-100 text-fuchsia-700" title={t('svc.mutation')}   />
          <Service to="/basundhara"bg="bg-pink-100 text-pink-700"       title={t('svc.basundhara')} />
          <Service to="/bhunaksha" bg="bg-blue-100 text-blue-700"       title={t('svc.bhunaksha')}  />
          <Service to="/e-khajana" bg="bg-accent-100 text-accent-700"   title={t('svc.ekhajana')}   />
          <Service to="/calculator"bg="bg-indigo-100 text-indigo-700"   title={t('svc.calculator')}/>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Service to="/schemes" bg="bg-emerald-100 text-emerald-700" title={t('svc.schemes')} />
          <Service to="/weather" bg="bg-sky-100 text-sky-700"         title={t('svc.weather')} />
          <Service to="/news"    bg="bg-rose-100 text-rose-700"       title={t('svc.news')} />
        </div>
      </section>

      {/* â”€â”€â”€â”€â”€ RATE / SHARE row â€” drives Play Store ranking â”€â”€â”€â”€â”€ */}
      {showRate && (
        <section className="rounded-2xl bg-gradient-to-r from-accent-400 via-magenta-500 to-brand-600 text-white p-4 shadow-pop relative">
          <button
            onClick={dismissRate}
            aria-label="Dismiss"
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 text-white grid place-items-center text-xs"
          >
            âœ•
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 grid place-items-center">
              <IconStar className="w-6 h-6 text-white"/>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold">
                {pick(lang, 'Love the app? Rate us 5 stars', 'à¦à¦ªà¦Ÿà§‹ à¦­à¦¾à¦² à¦ªà¦¾à¦²à§‡ à§« à¦¤à§°à¦¾ à¦¦à¦¿à¦¯à¦¼à¦•', 'à¤à¤ª à¤ªà¤¸à¤‚à¤¦ à¤†à¤¯à¤¾? 5 à¤¸à¥à¤Ÿà¤¾à¤° à¤°à¥‡à¤Ÿà¤¿à¤‚à¤— à¤¦à¥‡à¤‚')}
              </h4>
              <p className="text-[11px] text-white/90 mt-0.5">
                {pick(lang, 'Your rating helps other farmers find us.', 'à¦†à¦ªà§‹à¦¨à¦¾à§° à§°à§‡à¦Ÿà¦¿à¦™à§‡ à¦…à¦‡à¦¨à¦• à¦¸à¦¹à¦¾à¦¯à¦¼ à¦•à§°à¦¿à¦¬à¥¤', 'à¤†à¤ªà¤•à¥€ à¤°à¥‡à¤Ÿà¤¿à¤‚à¤— à¤…à¤¨à¥à¤¯ à¤•à¤¿à¤¸à¤¾à¤¨à¥‹à¤‚ à¤•à¥‹ à¤¹à¤®à¥‡à¤‚ à¤¢à¥‚à¤à¤¢à¤¨à¥‡ à¤®à¥‡à¤‚ à¤®à¤¦à¤¦ à¤•à¤°à¥‡à¤—à¥€à¥¤')}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => { dismissRate(); window.open('https://play.google.com/store/apps/details?id=com.asamland.info', '_blank'); }}
              className="flex-1 h-10 rounded-xl bg-white text-brand-700 font-semibold text-sm active:scale-[0.98] flex items-center justify-center gap-1"
            >
              <IconStar className="w-4 h-4"/>
              {pick(lang, 'Rate on Play Store', 'à§°à§‡à¦Ÿ à¦•à§°à¦•', 'Play Store à¤ªà¤° à¤°à¥‡à¤Ÿ à¤•à¤°à¥‡à¤‚')}
            </button>
            <button
              type="button"
              onClick={share}
              className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur text-white grid place-items-center active:scale-[0.98]"
              aria-label="Share"
            >
              <IconShare className="w-5 h-5"/>
            </button>
          </div>
        </section>
      )}

      {/* â”€â”€â”€â”€â”€ TRUST FOOTER â”€â”€â”€â”€â”€ */}
      <section className="rounded-2xl bg-slate-900 text-slate-200 p-4 text-[11px] space-y-1.5">
        <div className="flex items-center gap-2 text-white font-semibold text-xs">
          <IconShield className="w-4 h-4 text-brand-300"/>
          {pick(lang, 'Secure & private', 'à¦¨à¦¿à§°à¦¾à¦ªà¦¦ à¦†à§°à§ à¦—à§‹à¦ªà¦¨à§€à¦¯à¦¼', 'à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤”à¤° à¤¨à¤¿à¤œà¥€')}
        </div>
        <p className="text-slate-400 leading-relaxed">
          {lang === 'as'
            ? 'à¦•à§‹à¦¨à§‹ à¦¤à¦¥à§à¦¯ à¦•à§‡à¦¨à§à¦¦à§à§°à§€à¦­à§‚à¦¤ à¦›à¦¾à§°à§à¦­à¦¾à§°à¦¤ à§°à¦–à¦¾ à¦¨à¦¹à¦¯à¦¼à¥¤ à¦¸à¦•à¦²à§‹ à¦…à¦¨à§à§°à§‹à¦§ à¦ªà§‹à¦¨à§‡ à¦ªà§‹à¦¨à§‡ à¦šà§°à¦•à¦¾à§°à§€ à¦§à§°à¦¿à¦¤à§à§°à§€ à¦ªà§°à§à¦Ÿà§‡à¦²à¦²à§ˆ à¦¯à¦¾à¦¯à¦¼à¥¤ à¦•à§‡à¦ªà¦šà¦¾ à¦†à¦ªà§à¦¨à¦¿à¦¯à¦¼à§‡ à¦ªà§‚à§°à¦£ à¦•à§°à§‡à¥¤'
            : 'No data is stored on any server. Every request goes straight to the official Dharitree portal, and you solve the CAPTCHA yourself.'}
        </p>
      </section>

      <footer className="pt-1 pb-4 text-[10px] text-slate-400 text-center flex items-center justify-center gap-2">
        <AppLogo className="w-4 h-4 rounded-md" />
        v1.0 Â· {t('app.unofficial')}
      </footer>
    </div>
  );
}

/* â”€â”€â”€â”€â”€ Small bits â”€â”€â”€â”€â”€ */

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl py-2 px-1 border border-white/10">
      <div className="text-base font-extrabold leading-none">{n}</div>
      <div className="text-[9px] uppercase tracking-wider text-brand-100 mt-1">{l}</div>
    </div>
  );
}

function SampleRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-20 text-slate-500">{k}</span>
      <span className="flex-1 font-medium text-slate-900">{v}</span>
    </div>
  );
}

function Service({
  to, bg, title,
}: {
  to: string; bg: string; title: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl bg-white border border-slate-100 shadow-card p-2.5 flex flex-col items-center gap-1.5 active:scale-[0.98] text-center"
    >
      <span className={`w-10 h-10 rounded-2xl grid place-items-center ${bg}`}>
        <IconFor title={title}/>
      </span>
      <span className="text-[11px] font-semibold text-slate-800 leading-tight line-clamp-2">{title}</span>
    </Link>
  );
}

function IconFor({ title }: { title: string }) {
  const t = title.toLowerCase();
  if (/jama|à¦®à¦œà¦¾à¦¬à¦¨à§à¦¦à§€|à¦œà¦®à¦¾à¦¬à¦¨à§à¦¦à§€/.test(t)) return <IconDoc className="w-5 h-5"/>;
  if (/mut|à¦¨à¦¾à¦®à¦œà¦¾à§°à¦¿/.test(t))            return <IconDoc className="w-5 h-5"/>;
  if (/basu|à¦¬à¦¸à§à¦¨à§à¦§à§°à¦¾/.test(t))           return <IconLayers className="w-5 h-5"/>;
  if (/bhu|map|à¦®à¦¾à¦¨à¦šà¦¿à¦¤à§à§°/.test(t))        return <IconMap className="w-5 h-5"/>;
  if (/khaj|à¦–à¦¾à¦œà¦¨à¦¾/.test(t))             return <IconScheme className="w-5 h-5"/>;
  if (/calc|à¦¹à¦¿à¦šà¦¾à¦ª/.test(t))             return <IconCalc className="w-5 h-5"/>;
  if (/sche|à¦†à¦à¦šà¦¨à¦¿/.test(t))             return <IconScheme className="w-5 h-5"/>;
  if (/weath|à¦¬à¦¤à§°/.test(t))              return <IconWeather className="w-5 h-5"/>;
  if (/news|à¦¬à¦¾à¦¤à§°à¦¿/.test(t))             return <IconDoc className="w-5 h-5"/>;
  return <IconDoc className="w-5 h-5"/>;
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 3v7c0 5-3.5 9-8 10-4.5-1-8-5-8-10V5l8-3z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}

/* â”€â”€â”€â”€â”€ Onboarding â€” first launch only â”€â”€â”€â”€â”€ */

function Onboarding({ onDone }: { onDone: () => void }) {
  const { lang, setLang } = useI18n();
  const [i, setI] = useState(0);
  const slides = [
    {
      bg: 'from-brand-700 via-magenta-600 to-blue-700',
      emoji: 'ðŸŒ¾',
      title: pick(lang, 'Assam Land Records', 'à¦…à¦¸à¦®à§° à¦­à§‚à¦®à¦¿ à¦…à¦­à¦¿à¦²à§‡à¦–', 'à¤…à¤¸à¤® à¤­à¥‚à¤®à¤¿ à¤…à¤­à¤¿à¤²à¥‡à¤–'),
      body:  pick(lang,
        'Jamabandi, mutation, e-Khajana â€” all in one app.',
        'à¦œà¦®à¦¾à¦¬à¦¨à§à¦¦à§€, à¦¨à¦¾à¦®à¦œà¦¾à§°à¦¿, à¦‡-à¦–à¦¾à¦œà¦¨à¦¾ â€” à¦à¦Ÿà¦¾ à¦à¦ªà¦¤à§‡à¦‡à¥¤',
        'à¤œà¤®à¤¾à¤¬à¤‚à¤¦à¥€, à¤¨à¤¾à¤®à¤¾à¤‚à¤¤à¤°à¤£, à¤ˆ-à¤–à¤œà¤¾à¤¨à¤¾ â€” à¤à¤• à¤¹à¥€ à¤à¤ª à¤®à¥‡à¤‚à¥¤'),
    },
    {
      bg: 'from-sky-500 to-sky-800',
      emoji: 'ðŸ“„',
      title: pick(lang,
        'Live from the official portal',
        'à¦šà§°à¦•à¦¾à§°à§€ à¦›à¦¾à¦‡à¦Ÿà§° à¦ªà§°à¦¾ à¦ªà§‹à¦¨à§‡ à¦ªà§‹à¦¨à§‡',
        'à¤¸à¤°à¤•à¤¾à¤°à¥€ à¤ªà¥‹à¤°à¥à¤Ÿà¤² à¤¸à¥‡ à¤¸à¥€à¤§à¤¾'),
      body:  pick(lang,
        'Instant results from Dharitree ILRMS â€” never any fake data.',
        'à¦§à§°à¦¿à¦¤à§à§°à§€ ILRMS à§° à¦ªà§°à¦¾ à¦¤à§Žà¦•à¦¾à¦²à¦¿à¦• à¦«à¦²à¦¾à¦«à¦²à¥¤ à¦•à§‹à¦¨à§‹ à¦®à¦¿à¦›à¦¾ à¦¤à¦¥à§à¦¯ à¦¨à¦¾à¦‡à¥¤',
        'à¤§à¤°à¤¿à¤¤à¥à¤°à¥€ ILRMS à¤¸à¥‡ à¤¤à¥à¤°à¤‚à¤¤ à¤ªà¤°à¤¿à¤£à¤¾à¤®à¥¤ à¤•à¥‹à¤ˆ à¤¨à¤•à¤²à¥€ à¤¡à¥‡à¤Ÿà¤¾ à¤¨à¤¹à¥€à¤‚à¥¤'),
    },
    {
      bg: 'from-rose-500 to-rose-800',
      emoji: 'â¬‡ï¸',
      title: pick(lang, 'Download as PNG & PDF', 'PNG à¦†à§°à§ PDF à¦¡à¦¾à¦‰à¦¨à¦²\'à¦¡', 'PNG à¤”à¤° PDF à¤¡à¤¾à¤‰à¤¨à¤²à¥‹à¤¡ à¤•à¤°à¥‡à¤‚'),
      body:  pick(lang,
        'Save, print and share any record.',
        'à¦¸à¦žà§à¦šà¦¯à¦¼ à¦•à§°à¦•, à¦›à¦ªà¦¾ à¦•à§°à¦•, à¦¶à§à¦¬à§‡à¦¯à¦¼à¦¾à§° à¦•à§°à¦•à¥¤',
        'à¤•à¥‹à¤ˆ à¤­à¥€ à¤…à¤­à¤¿à¤²à¥‡à¤– à¤¸à¤¹à¥‡à¤œà¥‡à¤‚, à¤ªà¥à¤°à¤¿à¤‚à¤Ÿ à¤•à¤°à¥‡à¤‚ à¤”à¤° à¤¸à¤¾à¤à¤¾ à¤•à¤°à¥‡à¤‚à¥¤'),
    },
  ];
  const s = slides[i];
  const nextLang = lang === 'en' ? 'as' : lang === 'as' ? 'hi' : 'en';
  const nextLangLabel = nextLang === 'as' ? 'à¦…à¦¸à¦®à§€à¦¯à¦¼à¦¾' : nextLang === 'hi' ? 'à¤¹à¤¿à¤¨à¥à¤¦à¥€' : 'English';
  return (
    <div className={`rounded-3xl bg-gradient-to-br ${s.bg} text-white p-6 min-h-[70vh] flex flex-col shadow-pop`}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setLang(nextLang)}
          className="text-xs font-semibold bg-white/15 rounded-full px-3 py-1.5 backdrop-blur"
        >
          {nextLangLabel}
        </button>
        <button type="button" onClick={onDone} className="text-xs font-semibold text-white/80">
          {pick(lang, 'Skip', 'à¦à§°à¦¿ à¦¦à¦¿à¦¯à¦¼à¦•', 'à¤›à¥‹à¤¡à¤¼à¥‡à¤‚')}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {i === 0 ? (
          <AppLogo className="w-28 h-28 rounded-3xl mb-4 shadow-pop border border-white/40" />
        ) : (
          <div className="text-7xl mb-4 drop-shadow">{s.emoji}</div>
        )}
        <h1 className="text-2xl font-extrabold leading-tight">{s.title}</h1>
        <p className="text-sm text-white/90 mt-2 max-w-xs">{s.body}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5 mb-5" aria-hidden>
        {slides.map((_, k) => (
          <span
            key={k}
            className={'h-1.5 rounded-full transition-all ' + (k === i ? 'bg-white w-6' : 'bg-white/40 w-1.5')}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => i < slides.length - 1 ? setI(i + 1) : onDone()}
        className="w-full h-12 rounded-2xl bg-white text-slate-900 font-bold text-base shadow-pop active:scale-[0.98]"
      >
        {i < slides.length - 1
          ? pick(lang, 'Next', 'à¦ªà§°à§±à§°à§à¦¤à§€', 'à¤…à¤—à¤²à¤¾')
          : pick(lang, 'Get started', 'à¦†à§°à¦®à§à¦­ à¦•à§°à¦•', 'à¤¶à¥à¤°à¥‚ à¤•à¤°à¥‡à¤‚')}
      </button>
    </div>
  );
}
