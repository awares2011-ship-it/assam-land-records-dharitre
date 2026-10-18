import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { faqs } from '../data/faqs';
import { IconHelp } from '../components/Icon';

export default function Faq() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const items = faqs.filter(f => {
    if (!q.trim()) return true;
    const n = q.toLowerCase();
    return (
      f.q.toLowerCase().includes(n) ||
      f.a.toLowerCase().includes(n) ||
      (f.q_as ?? '').toLowerCase().includes(n)
    );
  });

  return (
    <div className="space-y-4">
      <PageHeader title={t('svc.faq')} icon={<IconHelp className="w-5 h-5"/>} />
      <input
        className="input"
        placeholder={lang === 'as' ? 'সন্ধান…' : 'Search…'}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <ul className="space-y-2.5">
        {items.map((f, i) => (
          <li key={i} className="m3-card p-4">
            <h3 className="text-[15px] font-semibold text-slate-900">
              {lang === 'as' && f.q_as ? f.q_as : f.q}
            </h3>
            <p className="text-sm text-slate-700 mt-1 leading-relaxed">
              {lang === 'as' && f.a_as ? f.a_as : f.a}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
