import InfoPage from '../components/InfoPage';
import { useI18n } from '../i18n/I18nProvider';
import { IconScheme } from '../components/Icon';

export default function EKhajana() {
  const { lang } = useI18n();
  return (
    <InfoPage
      title={lang === 'as' ? 'ই-খাজনা (Online land revenue)' : 'e-Khajana (Online land revenue)'}
      icon={<IconScheme className="w-5 h-5"/>}
      intro={lang === 'as'
        ? 'পাট্টাধাৰীসকলৰ বাবে অনলাইন ভূমি ৰাজহ পৰিশোধ।'
        : 'Online payment of land revenue (khajana) for Assam patta holders.'}
      sections={[
        {
          heading: lang === 'as' ? 'প্ৰক্ৰিয়া' : 'Steps',
          items: lang === 'as'
            ? ['ধৰিত্ৰী / ILRMS পৰ্টেল খোলক।', 'ই-খাজনা সেৱা বাছনি কৰক।', 'জিলা, চক্ৰ, গাঁও আৰু পাট্টা দিয়ক।', 'অনলাইনত পৰিশোধ কৰক।', 'পাৱতি ডাউনল\'ড কৰি সংৰক্ষণ কৰক।']
            : ['Open the Dharitree / ILRMS portal.', 'Select the e-Khajana service.', 'Enter district, circle, village and patta.', 'Pay online.', 'Download and keep the receipt.'],
        },
      ]}
      links={[
        { label: 'Revenue & DM Dept', url: 'https://landrevenue.assam.gov.in/' },
        { label: 'ILRMS',             url: 'https://ilrms.assam.gov.in/' },
      ]}
    />
  );
}
