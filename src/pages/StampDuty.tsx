import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Disclaimer from '../components/Disclaimer';
import OfficialLink from '../components/OfficialLink';
import { useI18n } from '../i18n/I18nProvider';
import { IconDoc } from '../components/Icon';

// Rates per Government of Assam notifications under the Indian Stamp Act (as applicable in Assam).
// Treat as estimates — the registering officer uses the current notification + circle rate (bazaar
// rate) and the actual deed value, whichever is higher. These numbers are commonly cited; the UI
// clearly marks the result as an estimate.
const STAMP_RATE_URBAN = 0.085; // 8.5%
const STAMP_RATE_RURAL = 0.070; // 7.0%

export default function StampDuty() {
  const { t, lang } = useI18n();
  const [value, setValue] = useState('1000000');
  const [area, setArea] = useState<'urban' | 'rural'>('urban');

  const parsed = Number((value || '0').replace(/[^0-9.]/g, ''));
  const stampRate = area === 'urban' ? STAMP_RATE_URBAN : STAMP_RATE_RURAL;

  const result = useMemo(() => ({
    stamp: parsed * stampRate,
    reg: parsed * 0.0085,                 // registration fee ~0.85%
    total: parsed * (stampRate + 0.0085),
  }), [parsed, stampRate]);

  const inr = (x: number) =>
    x.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('svc.stampduty')}
        subtitle={lang === 'as' ? 'এটা আনুমানিক গণনা' : 'Estimate only'}
        icon={<IconDoc className="w-5 h-5"/>}
      />
      <section className="m3-card p-4 space-y-3">
        <div>
          <label className="label">{lang === 'as' ? 'বিক্ৰীৰ মূল্য (₹)' : 'Transaction value (₹)'}</label>
          <input
            inputMode="numeric"
            className="input text-lg font-medium"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>
        <div>
          <label className="label">{lang === 'as' ? 'অঞ্চল' : 'Area'}</label>
          <div className="flex gap-2">
            <Btn active={area === 'urban'} onClick={() => setArea('urban')}>{lang === 'as' ? 'নগৰ' : 'Urban'}</Btn>
            <Btn active={area === 'rural'} onClick={() => setArea('rural')}>{lang === 'as' ? 'গ্ৰাম্য' : 'Rural'}</Btn>
          </div>
        </div>

        <div className="rounded-xl bg-brand-50 border border-brand-100 p-3 space-y-1 text-sm">
          <Row k={lang === 'as' ? 'ষ্টাম্প শুল্ক' : 'Stamp duty'} v={inr(result.stamp)} />
          <Row k={lang === 'as' ? 'পঞ্জীকৰণ শুল্ক' : 'Registration fee'} v={inr(result.reg)} />
          <div className="pt-1 mt-1 border-t border-brand-200 flex items-center justify-between font-semibold text-brand-900">
            <span>{lang === 'as' ? 'মুঠ (আনুমানিক)' : 'Total (approx)'}</span>
            <span>{inr(result.total)}</span>
          </div>
        </div>
      </section>

      <section className="m3-card p-4 space-y-2 text-sm text-slate-700">
        <p>
          {lang === 'as'
            ? 'প্ৰকৃত শুল্ক নিৰ্ভৰ কৰে বৰ্তমানৰ অধিসূচনা, মহকুমা দৰ (circle rate / bazaar rate) আৰু চনদৰ প্ৰকৃতিৰ ওপৰত।'
            : 'Actual duty depends on the current notification, circle (bazaar) rate and nature of the deed.'}
        </p>
        <OfficialLink url="https://landrevenue.assam.gov.in/" label="Revenue & DM Dept" variant="ghost"/>
      </section>

      <Disclaimer />
    </div>
  );
}

function Btn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex-1 rounded-xl py-2 text-sm font-medium border transition ' +
        (active ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200')
      }
    >
      {children}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-brand-800">{k}</span>
      <span className="font-medium text-brand-900">{v}</span>
    </div>
  );
}
