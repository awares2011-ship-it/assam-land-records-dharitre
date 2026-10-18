import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { allUnits, convert, formatNum, unitLabels, type Unit } from '../data/conversions';
import { IconCalc, IconSwap, IconCopy, IconReset } from '../components/Icon';

export default function Calculator() {
  const { t, lang } = useI18n();
  const [value, setValue] = useState<string>('1');
  const [from, setFrom] = useState<Unit>('bigha');
  const [to, setTo] = useState<Unit>('katha');

  const [plotLen, setPlotLen] = useState<string>('100');
  const [plotBr, setPlotBr] = useState<string>('80');
  const [plotUnit, setPlotUnit] = useState<Unit>('sqft');

  const n = Number(value || 0);
  const result = useMemo(() => convert(n, from, to), [n, from, to]);

  const allResults = useMemo(
    () => allUnits
      .filter(u => u !== from)
      .map(u => ({ u, v: convert(n, from, u) })),
    [n, from],
  );

  const plotLenN = Number(plotLen || 0);
  const plotBrN  = Number(plotBr || 0);
  const plotArea = plotLenN * plotBrN;

  const label = (u: Unit) => unitLabels[u][lang];

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('calc.title')}
        subtitle={t('calc.subtitle')}
        icon={<IconCalc className="w-5 h-5" />}
      />

      {/* Converter */}
      <section className="m3-card p-4 space-y-3">
        <div>
          <label className="label" htmlFor="val">{t('calc.value')}</label>
          <input
            id="val"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ''))}
            className="input text-lg font-medium"
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <div>
            <label className="label" htmlFor="from">{t('calc.from')}</label>
            <select id="from" value={from} onChange={(e) => setFrom(e.target.value as Unit)} className="input">
              {allUnits.map(u => <option key={u} value={u}>{label(u)}</option>)}
            </select>
          </div>
          <button
            type="button"
            onClick={() => { const a = from; setFrom(to); setTo(a); }}
            className="h-11 w-11 rounded-xl bg-brand-50 text-brand-700 grid place-items-center"
            aria-label={t('calc.swap')}
          >
            <IconSwap className="w-5 h-5"/>
          </button>
          <div>
            <label className="label" htmlFor="to">{t('calc.to')}</label>
            <select id="to" value={to} onChange={(e) => setTo(e.target.value as Unit)} className="input">
              {allUnits.map(u => <option key={u} value={u}>{label(u)}</option>)}
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-brand-50 border border-brand-100 p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-brand-700/80">{t('calc.result')}</div>
            <div className="text-xl font-semibold text-brand-900">
              {formatNum(result)}{' '}
              <span className="text-sm font-medium text-brand-800">{label(to)}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              className="p-2 rounded-xl bg-white text-slate-600 border border-slate-200"
              onClick={() => copy(`${formatNum(result)} ${label(to)}`)}
              aria-label={t('common.copy')}
            >
              <IconCopy className="w-4 h-4"/>
            </button>
            <button
              className="p-2 rounded-xl bg-white text-slate-600 border border-slate-200"
              onClick={() => setValue('')}
              aria-label={t('common.reset')}
            >
              <IconReset className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </section>

      {/* All units at a glance */}
      <section className="m3-card p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          {n || 0} {label(from)} =
        </h3>
        <ul className="divide-y divide-slate-100">
          {allResults.map(({ u, v }) => (
            <li key={u} className="flex items-center justify-between py-2 text-sm">
              <span className="text-slate-600">{label(u)}</span>
              <span className="font-medium text-slate-900">{formatNum(v)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Plot calculator */}
      <section className="m3-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">{t('calc.plot')}</h3>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label" htmlFor="plen">{t('calc.length')}</label>
            <input id="plen" inputMode="decimal" className="input"
              value={plotLen}
              onChange={(e) => setPlotLen(e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </div>
          <div>
            <label className="label" htmlFor="pbr">{t('calc.breadth')}</label>
            <input id="pbr" inputMode="decimal" className="input"
              value={plotBr}
              onChange={(e) => setPlotBr(e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </div>
        </div>

        <div>
          <label className="label">{t('calc.from')}</label>
          <select className="input" value={plotUnit} onChange={(e) => setPlotUnit(e.target.value as Unit)}>
            {(['sqft','sqm'] as Unit[]).map(u => (
              <option key={u} value={u}>{label(u)}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
          <div className="text-xs text-slate-500">{t('calc.result')} ({label(plotUnit)})</div>
          <div className="text-lg font-semibold text-slate-900">{formatNum(plotArea)}</div>
          <ul className="mt-2 text-xs text-slate-600 grid grid-cols-2 gap-y-0.5">
            {(['bigha','katha','lecha','acre','hectare'] as Unit[]).map(u => (
              <li key={u}>{label(u)}: <span className="font-medium text-slate-800">{formatNum(convert(plotArea, plotUnit, u))}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <p className="text-xs text-slate-500 px-1">{t('calc.note')}</p>
    </div>
  );
}
