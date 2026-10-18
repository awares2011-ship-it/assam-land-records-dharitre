import InfoPage from '../components/InfoPage';
import { useI18n } from '../i18n/I18nProvider';
import { IconDoc } from '../components/Icon';

export default function Jamabandi() {
  const { lang } = useI18n();
  const en = {
    title: 'Jamabandi (Record of Rights)',
    intro:
      'Jamabandi is the Record of Rights (ROR) that lists landowners, dag numbers, areas and revenue for every plot in a village. It is maintained by the circle office and published through the Dharitree system.',
    whatItShows: ['Owner name(s) and share', 'Dag (plot) numbers', 'Patta / Khatian numbers', 'Classification of land', 'Revenue payable'],
    howTo: [
      'Open the Land Record search inside this app.',
      'Pick district → circle → village.',
      'On the official Dharitree page, enter patta / dag details and the CAPTCHA shown.',
      'View the jamabandi entry; take a printout if needed.',
    ],
  };
  const as = {
    title: 'জমাবন্দী (স্বত্বাভিলেখ)',
    intro:
      'জমাবন্দী হ\'ল স্বত্বাভিলেখ — এখন গাঁৱৰ প্ৰতিটো ভূমিৰ মালিক, দাগ নম্বৰ, পৰিমাণ আৰু ৰাজহ তালিকা। ই চক্ৰ কাৰ্যালয়ত ৰখা হয় আৰু ধৰিত্ৰী প্ৰণালীৰে প্ৰকাশ কৰা হয়।',
    whatItShows: ['মালিকৰ নাম আৰু অংশ', 'দাগ নম্বৰ', 'পাট্টা / খতিয়ান নম্বৰ', 'ভূমিৰ শ্ৰেণীবিভাজন', 'প্ৰদেয় ৰাজহ'],
    howTo: [
      'এপৰ ভূমি সন্ধান পৃষ্ঠা খোলক।',
      'জিলা → চক্ৰ → গাঁও বাছনি কৰক।',
      'ধৰিত্ৰী পৃষ্ঠাত পাট্টা / দাগ আৰু কেপচা দিয়ক।',
      'জমাবন্দী চাওক, প্ৰয়োজন হ\'লে প্ৰিণ্ট কৰক।',
    ],
  };
  const d = lang === 'as' ? as : en;
  return (
    <InfoPage
      title={d.title}
      icon={<IconDoc className="w-5 h-5" />}
      intro={d.intro}
      sections={[
        { heading: lang === 'as' ? 'ই কি দেখুৱায়' : 'What it shows',  items: d.whatItShows },
        { heading: lang === 'as' ? 'কেনেকৈ চাব'   : 'How to view it', items: d.howTo },
      ]}
      links={[
        { label: 'Dharitree',          url: 'https://ilrms.assam.gov.in/dhar/index.php/Welcome/SelectLOC' },
        { label: 'ILRMS',              url: 'https://ilrms.assam.gov.in/' },
        { label: 'Mission Basundhara', url: 'https://basundhara.assam.gov.in/' },
      ]}
    />
  );
}
