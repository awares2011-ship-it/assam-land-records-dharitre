import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Disclaimer from '../components/Disclaimer';
import { useI18n } from '../i18n/I18nProvider';
import { IconCalc } from '../components/Icon';

export default function EmiCalculator() {
  const { lang } = useI18n();
  const [principal, setPrincipal] = useState('500000');
  const [ratePct, setRatePct]     = useState('9');
  const [years, setYears]         = useState('10');

  const P = Number(principal || 0);
  const R = Number(ratePct || 0) / 1200;
  const N = Number(years || 0) * 12;

  const emi = useMemo(() => {
    if (!P || !R || !N) return 0;
    const x = Math.pow(1 + R, N);
    return (P * R * x) / (x - 1);
  }, [P, R, N]);

  const total = emi * N;
  const interest = total - P;

  const inr = (x: number) =>
    x.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <PageHeader
        title={lang === 'as' ? 'ই এম আই হিচাপ' : 'EMI Calculator'}
        icon={<IconCalc className="w-5 h-5"/>}
      />

      <section className="m3-card p-4 space-y-3">
        <Field label={lang === 'as' ? 'মূলধন (₹)' : 'Principal (₹)'} value={principal} onChange={setPrincipal} />
        <Field label={lang === 'as' ? 'সুদৰ হাৰ (%)' : 'Interest rate (% p.a.)'} value={ratePct} onChange={setRatePct} />
        <Field label={lang === 'as' ? 'অৱধি (বছৰ)' : 'Tenure (years)'} value={years} onChange={setYears} />

        <div className="rounded-xl bg-brand-50 border border-brand-100 p-3 space-y-1 text-sm">
          <Row k={lang === 'as' ? 'মাহিলী ই এম আই' : 'Monthly EMI'} v={inr(emi)} big />
          <Row k={lang === 'as' ? 'মুঠ সুদ' : 'Total interest'} v={inr(interest)} />
          <Row k={lang === 'as' ? 'মুঠ পৰিশোধ' : 'Total payable'} v={inr(total)} />
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (s: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        inputMode="decimal"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
      />
    </div>
  );
}
function Row({ k, v, big }: { k: string; v: string; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-brand-800">{k}</span>
      <span className={`font-semibold text-brand-900 ${big ? 'text-lg' : ''}`}>{v}</span>
    </div>
  );
}
