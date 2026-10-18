import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { schemes, schemeCategories, type SchemeCategory } from '../data/schemes';
import { IconScheme, IconSearch } from '../components/Icon';
import Disclaimer from '../components/Disclaimer';

export default function Schemes() {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<SchemeCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schemes.filter((s) => {
      if (cat !== 'all' && s.category !== cat) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        (s.name_as ?? '').toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  const catLabel = (k: SchemeCategory) => {
    const c = schemeCategories.find(x => x.key === k);
    return c ? (lang === 'as' ? c.label_as : c.label) : k;
  };

  return (
    <div className="space-y-4">
      <PageHeader title={t('sch.title')} icon={<IconScheme className="w-5 h-5" />} />

      <section className="m3-card p-3 space-y-2">
        <div className="relative">
          <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder={t('sch.search_ph')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
          <Chip active={cat === 'all'} onClick={() => setCat('all')}>{t('sch.all')}</Chip>
          {schemeCategories.map(c => (
            <Chip key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>
              {lang === 'as' ? c.label_as : c.label}
            </Chip>
          ))}
        </div>
      </section>

      <section className="space-y-2.5">
        {filtered.length === 0 && (
          <div className="m3-card p-5 text-sm text-slate-500 text-center">{t('common.empty')}</div>
        )}
        {filtered.map((s) => (
          <Link
            key={s.id}
            to={`/schemes/${s.id}`}
            className="m3-card p-4 flex flex-col gap-1 active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-slate-900">
                {lang === 'as' && s.name_as ? s.name_as : s.name}
              </h3>
              <span className="chip-brand">{catLabel(s.category)}</span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">
              {lang === 'as' && s.description_as ? s.description_as : s.description}
            </p>
          </Link>
        ))}
      </section>
      <Disclaimer />
    </div>
  );
}

function Chip({
  children, active, onClick,
}: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition ' +
        (active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-white text-slate-700 border-slate-200')
      }
    >
      {children}
    </button>
  );
}
