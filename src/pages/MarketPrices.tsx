import PageHeader from '../components/PageHeader';
import OfficialLink from '../components/OfficialLink';
import Disclaimer from '../components/Disclaimer';
import { useI18n } from '../i18n/I18nProvider';
import { IconMarket } from '../components/Icon';

export default function MarketPrices() {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-4">
      <PageHeader title={t('svc.market')} icon={<IconMarket className="w-5 h-5"/>} />

      <section className="m3-card p-4 space-y-3">
        <p className="text-sm text-slate-700 leading-relaxed">
          {lang === 'as'
            ? 'মণ্ডীৰ পাইকাৰী মূল্য চৰকাৰী উৎস Agmarknet-ত উপলব্ধ। এই এপে ভুৱা দৰ দেখুৱাব নালাগে — চৰকাৰী ছাইটতেই চাওক।'
            : 'Mandi wholesale prices are published on the Government source Agmarknet. The app does not fabricate prices — view them on the official site.'}
        </p>
        <OfficialLink url="https://agmarknet.gov.in/" label="Open Agmarknet" />
      </section>

      <section className="m3-card p-4 space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">
          {lang === 'as' ? 'তথ্যৰ উৎস' : 'Data sources'}
        </h3>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Agmarknet (Directorate of Marketing & Inspection)</li>
          <li>e-NAM — National Agriculture Market</li>
          <li>Assam State Agricultural Marketing Board (ASAMB)</li>
        </ul>
        <div className="flex flex-wrap gap-2 pt-1">
          <OfficialLink url="https://enam.gov.in/web/" label="e-NAM" variant="ghost" />
          <OfficialLink url="https://asamb.assam.gov.in/" label="ASAMB" variant="ghost" />
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
