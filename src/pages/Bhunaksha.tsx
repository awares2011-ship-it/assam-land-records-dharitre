import InfoPage from '../components/InfoPage';
import { useI18n } from '../i18n/I18nProvider';
import { IconMap } from '../components/Icon';

export default function Bhunaksha() {
  const { lang } = useI18n();
  return (
    <InfoPage
      title={lang === 'as' ? 'ভূনকশা মানচিত্ৰ' : 'Bhunaksha (Land Map)'}
      icon={<IconMap className="w-5 h-5"/>}
      intro={lang === 'as'
        ? 'ভূনকশা হ\'ল এটা ৱেব-ভিত্তিক মানচিত্ৰ দৰ্শক যিয়ে গাঁৱত ভূমিৰ সীমা আৰু দাগ দেখুৱায়।'
        : 'Bhunaksha is a web-based cadastral map viewer that shows plot boundaries and dags in a village.'}
      sections={[
        {
          heading: lang === 'as' ? 'কেনেকৈ চাব' : 'How to use',
          items: lang === 'as'
            ? ['Bhunaksha Assam পৰ্টেল খোলক', 'জিলা, চক্ৰ, গাঁও বাছনি', 'দাগ নম্বৰত ক্লিক কৰি তথ্য চাওক', 'প্ৰয়োজন হ\'লে মানচিত্ৰ প্ৰিণ্ট কৰক']
            : ['Open Bhunaksha Assam portal', 'Select district, circle, village', 'Click a dag to view details', 'Print the map if required'],
        },
      ]}
      links={[
        { label: 'DLR Assam',        url: 'https://dlrs.assam.gov.in/' },
        { label: 'ILRMS (Dharitree)', url: 'https://ilrms.assam.gov.in/' },
      ]}
    />
  );
}
