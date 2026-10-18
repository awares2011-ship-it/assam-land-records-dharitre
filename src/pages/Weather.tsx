import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { districtGeos } from '../data/districtWeather';
import { describe, fetchWeather, type WeatherData } from '../services/weather';
import { IconWeather } from '../components/Icon';

const STORAGE_KEY = 'ad.wx.district';

export default function Weather() {
  const { t, lang } = useI18n();
  const [code, setCode] = useState<string>(() => localStorage.getItem(STORAGE_KEY) ?? 'GHY');
  const geo = useMemo(() => districtGeos.find(g => g.code === code) ?? districtGeos[0], [code]);

  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'ok'; data: WeatherData }
    | { status: 'error'; msg: string }
  >({ status: 'idle' });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }
    let active = true;
    setState({ status: 'loading' });
    fetchWeather(geo.lat, geo.lon)
      .then((data) => { if (active) setState({ status: 'ok', data }); })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Request failed';
        if (active) setState({ status: 'error', msg });
      });
    return () => { active = false; };
  }, [code, geo.lat, geo.lon]);

  const nameOf = (en: string, as: string) => (lang === 'as' ? as : en);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('wx.title')}
        subtitle={t('wx.source')}
        icon={<IconWeather className="w-5 h-5" />}
      />

      {/* District picker */}
      <section className="m3-card p-4">
        <label className="label" htmlFor="wxdist">{t('wx.pick_district')}</label>
        <select
          id="wxdist"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="input"
        >
          {districtGeos.map(g => (
            <option key={g.code} value={g.code}>
              {nameOf(g.name, g.name_as)}
            </option>
          ))}
        </select>
      </section>

      {state.status === 'loading' && (
        <div className="m3-card p-5 text-sm text-slate-500">{t('common.loading')}</div>
      )}
      {state.status === 'error' && (
        <div className="m3-card p-5 text-sm text-rose-700 bg-rose-50 border-rose-100">
          {t('common.error')} — {state.msg}
        </div>
      )}
      {state.status === 'ok' && (() => {
        const now = describe(state.data.current.weatherCode);
        return (
          <>
            <section className="m3-card p-5 bg-gradient-to-br from-sky-500 to-sky-700 text-white border-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-sky-100">{t('wx.now')} • {nameOf(geo.name, geo.name_as)}</div>
                  <div className="mt-1 text-4xl font-semibold">{Math.round(state.data.current.temperature)}°C</div>
                  <div className="text-sm text-sky-100 mt-1">
                    {lang === 'as' ? now.label_as : now.label}
                  </div>
                </div>
                <div className="text-6xl leading-none">{now.emoji}</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-xl bg-white/15 py-2">
                  <div className="text-sky-100 text-xs">{t('wx.humidity')}</div>
                  <div className="font-medium">{state.data.current.humidity}%</div>
                </div>
                <div className="rounded-xl bg-white/15 py-2">
                  <div className="text-sky-100 text-xs">{t('wx.wind')}</div>
                  <div className="font-medium">{Math.round(state.data.current.windSpeed)} km/h</div>
                </div>
                <div className="rounded-xl bg-white/15 py-2">
                  <div className="text-sky-100 text-xs">{t('wx.rain')}</div>
                  <div className="font-medium">{state.data.forecast[0]?.rainProb ?? 0}%</div>
                </div>
              </div>
            </section>

            <section className="m3-card p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">{t('wx.forecast')}</h3>
              <ul className="divide-y divide-slate-100">
                {state.data.forecast.map((d) => {
                  const info = describe(d.weatherCode);
                  const date = new Date(d.date);
                  return (
                    <li key={d.date} className="flex items-center justify-between py-2 text-sm">
                      <span className="w-20 text-slate-700">
                        {date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-xl">{info.emoji}</span>
                      <span className="text-slate-500 w-20 text-center">{d.rainProb}%</span>
                      <span className="w-24 text-right font-medium text-slate-900">
                        {Math.round(d.tMax)}° / {Math.round(d.tMin)}°
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <p className="text-[11px] text-slate-400 px-1">
              {t('common.source')}: {state.data.source} • {t('common.last_updated')}:{' '}
              {new Date(state.data.retrievedAt).toLocaleString()}
            </p>
          </>
        );
      })()}
    </div>
  );
}
