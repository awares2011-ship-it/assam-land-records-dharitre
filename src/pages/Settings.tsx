import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { IconSettings, IconDoc, IconBookmark, IconHelp, IconInfo, IconLang } from '../components/Icon';
import { openOfficial } from '../components/OfficialLink';

const PRIVACY_URL = 'https://awares2011-ship-it.github.io/assam-land-records-dharitre/privacy-policy.html';

export default function Settings() {
  const { t, lang, setLang } = useI18n();
  return (
    <div className="space-y-4">
      <PageHeader title={t('set.title')} icon={<IconSettings className="w-5 h-5"/>} />

      <section className="m3-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <IconLang className="w-4 h-4 text-brand-700"/> {t('set.language')}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setLang('en')}
            className={
              'rounded-xl py-2.5 text-sm font-medium border transition ' +
              (lang === 'en' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200')
            }
          >
            English
          </button>
          <button
            onClick={() => setLang('as')}
            className={
              'rounded-xl py-2.5 text-sm font-medium border transition lang-as ' +
              (lang === 'as' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200')
            }
          >
            অসমীয়া
          </button>
          <button
            onClick={() => setLang('hi')}
            className={
              'rounded-xl py-2.5 text-sm font-medium border transition lang-hi ' +
              (lang === 'hi' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200')
            }
          >
            हिन्दी
          </button>
        </div>
      </section>

      <section className="m3-card divide-y divide-slate-100">
        <Row to="/notifications" icon={<IconSettings/>} label={lang === 'as' ? 'স্মাৰ্ট নটিফিকেচন' : 'Smart notifications'} />
        <Row to="/saved"         icon={<IconBookmark/>} label={t('svc.saved')} />
        <Row to="/glossary"      icon={<IconDoc/>}      label="Glossary" />
        <Row to="/faq"           icon={<IconHelp/>}     label={t('svc.faq')} />
        <Row to="/feedback"      icon={<IconHelp/>}     label="Feedback" />
        <Row to="/about"         icon={<IconInfo/>}     label={t('set.about')} />
        <ExtRow url={PRIVACY_URL} icon={<IconInfo/>}     label={lang === 'as' ? 'গোপনীয়তা নীতি' : 'Privacy policy'} />
      </section>
    </div>
  );
}

function ExtRow({ url, icon, label }: { url: string; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={() => openOfficial(url)}
      className="w-full flex items-center gap-3 px-4 py-3 active:bg-slate-50 text-left"
    >
      <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
        <span className="w-4 h-4 inline-block [&_svg]:w-4 [&_svg]:h-4">{icon}</span>
      </span>
      <span className="text-sm font-medium text-slate-800 flex-1">{label}</span>
      <span className="text-slate-300">↗</span>
    </button>
  );
}

function Row({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-3 active:bg-slate-50">
      <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
        <span className="w-4 h-4 inline-block [&_svg]:w-4 [&_svg]:h-4">{icon}</span>
      </span>
      <span className="text-sm font-medium text-slate-800 flex-1">{label}</span>
      <span className="text-slate-300">›</span>
    </Link>
  );
}
