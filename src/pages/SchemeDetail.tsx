import { useParams, Navigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import OfficialLink from '../components/OfficialLink';
import { useI18n } from '../i18n/I18nProvider';
import { schemes } from '../data/schemes';
import Disclaimer from '../components/Disclaimer';
import { IconScheme } from '../components/Icon';

export default function SchemeDetail() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const s = schemes.find((x) => x.id === id);
  if (!s) return <Navigate to="/schemes" replace />;

  const name = lang === 'as' && s.name_as ? s.name_as : s.name;
  const desc = lang === 'as' && s.description_as ? s.description_as : s.description;

  return (
    <div className="space-y-4">
      <PageHeader title={name} subtitle={s.source} icon={<IconScheme className="w-5 h-5" />} />

      <section className="m3-card p-4">
        <p className="text-sm text-slate-700 leading-relaxed">{desc}</p>
      </section>

      <Block title={t('sch.eligibility')} items={s.eligibility} />
      <Block title={t('sch.benefits')}    items={s.benefits} />
      <Block title={t('sch.documents')}   items={s.documents} />
      <Block title={t('sch.steps')}       items={s.steps} ordered />

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          {t('common.last_updated')}: {s.verifiedOn}
        </span>
        <OfficialLink url={s.officialUrl} label={t('sch.apply')} />
      </div>
      <Disclaimer />
    </div>
  );
}

function Block({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section className="m3-card p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-2">{title}</h3>
      <List className={ordered ? 'list-decimal pl-5 space-y-1.5 text-sm text-slate-700' : 'list-disc pl-5 space-y-1.5 text-sm text-slate-700'}>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </List>
    </section>
  );
}
