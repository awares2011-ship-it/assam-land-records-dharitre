import InfoPage from '../components/InfoPage';
import { useI18n } from '../i18n/I18nProvider';
import { IconLayers } from '../components/Icon';

export default function Basundhara() {
  const { lang } = useI18n();
  return (
    <InfoPage
      title={lang === 'as' ? 'মিছন বসুন্ধৰা' : 'Mission Basundhara'}
      icon={<IconLayers className="w-5 h-5"/>}
      intro={lang === 'as'
        ? 'অসম চৰকাৰৰ এটা ভূমি অভিলেখ অভিযান — অনলাইন নামজাৰি, বিভাজন, পুনৰ-শ্ৰেণীবিভাজন আদি।'
        : 'Flagship land-records mission of the Government of Assam — online mutation, partition, reclassification and settlement services.'}
      sections={[
        {
          heading: lang === 'as' ? 'প্ৰদান কৰা সেৱা' : 'Services offered',
          items: lang === 'as'
            ? ['অনলাইন নামজাৰি', 'পাট্টা বিভাজন', 'ভূমিৰ পুনৰ-শ্ৰেণীবিভাজন', 'চৰকাৰী ভূমিৰ বিক্ৰী / নিষ্পত্তি', 'স্বত্বাভিলেখ সংশোধন']
            : ['Online mutation (namjari)', 'Partition of patta', 'Reclassification of land', 'Settlement of Government land', 'Correction of records'],
        },
        {
          heading: lang === 'as' ? 'প্ৰয়োজনীয় নথি' : 'Documents needed',
          items: lang === 'as'
            ? ['জমাবন্দী / পাট্টা', 'ক্ৰয়-বিক্ৰয় চনদ বা উত্তৰাধিকাৰ প্ৰমাণ', 'আধাৰ', 'মোবাইল নম্বৰ']
            : ['Jamabandi / Patta', 'Sale deed or inheritance document', 'Aadhaar', 'Mobile number'],
        },
      ]}
      links={[
        { label: 'Mission Basundhara', url: 'https://basundhara.assam.gov.in/' },
      ]}
    />
  );
}
