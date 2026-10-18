import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { glossary } from '../data/glossary';
import { IconDoc } from '../components/Icon';

export default function Glossary() {
  const { lang } = useI18n();
  const [q, setQ] = useState('');

  const items = glossary.filter(e => {
    if (!q.trim()) return true;
    const n = q.toLowerCase();
    return (
      e.term.toLowerCase().includes(n) ||
      (e.term_as ?? '').toLowerCase().includes(n) ||
      e.meaning.toLowerCase().includes(n)
    );
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title={lang === 'as' ? 'অসমীয়া পাৰিভাষিক শব্দ' : 'Assamese Glossary'}
        icon={<IconDoc className="w-5 h-5"/>}
      />
      <input
        className="input"
        placeholder={lang === 'as' ? 'শব্দ সন্ধান…' : 'Search term…'}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <ul className="space-y-2.5">
        {items.map((g, i) => (
          <li key={i} className="m3-card p-4">
            <h3 className="text-[15px] font-semibold text-slate-900">
              {g.term} {g.term_as ? <span className="text-brand-700 font-normal">· {g.term_as}</span> : null}
            </h3>
            <p className="text-sm text-slate-700 mt-1 leading-relaxed">
              {lang === 'as' && g.meaning_as ? g.meaning_as : g.meaning}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
