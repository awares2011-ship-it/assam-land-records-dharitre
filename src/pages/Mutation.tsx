import InfoPage from '../components/InfoPage';
import { useI18n } from '../i18n/I18nProvider';
import { IconDoc } from '../components/Icon';

export default function Mutation() {
  const { lang } = useI18n();
  return (
    <InfoPage
      title={lang === 'as' ? 'নামজাৰি (Mutation)' : 'Mutation (Namjari)'}
      icon={<IconDoc className="w-5 h-5"/>}
      intro={lang === 'as'
        ? 'ক্ৰয়-বিক্ৰয়, উত্তৰাধিকাৰ বা উপহাৰৰ পাছত নতুন মালিকৰ নাম স্বত্বাভিলেখত সংযোজন।'
        : 'Updating the record of rights with the new owner after sale, inheritance or gift.'}
      sections={[
        {
          heading: lang === 'as' ? 'প্ৰক্ৰিয়া' : 'Process',
          items: lang === 'as'
            ? [
                'Mission Basundhara পৰ্টেলত পঞ্জীকৰণ কৰক।',
                'সেৱা হিচাপে “নামজাৰি” বাছনি কৰক।',
                'নথি আপল\'ড কৰক (চনদ, জমাবন্দী, আধাৰ)।',
                'শুনানি তাৰিখলৈ অপেক্ষা কৰক আৰু উপস্থিত হওক।',
                'অনুমোদনৰ পাছত ডিজিটেল জমাবন্দী চাওক।',
              ]
            : [
                'Register at Mission Basundhara portal.',
                'Select “Mutation” service.',
                'Upload documents (deed, jamabandi, Aadhaar).',
                'Wait for hearing date and attend.',
                'View updated jamabandi after approval.',
              ],
        },
      ]}
      links={[
        { label: 'Mission Basundhara', url: 'https://basundhara.assam.gov.in/' },
      ]}
    />
  );
}
