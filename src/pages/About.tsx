import PageHeader from '../components/PageHeader';
import Disclaimer from '../components/Disclaimer';
import OfficialLink from '../components/OfficialLink';
import { useI18n } from '../i18n/I18nProvider';
import { IconInfo } from '../components/Icon';

export default function About() {
  const { lang } = useI18n();
  return (
    <div className="space-y-4">
      <PageHeader
        title={lang === 'as' ? 'এপৰ বিষয়ে' : 'About'}
        subtitle={lang === 'as' ? 'অনানুষ্ঠানিক নাগৰিক সহায়ক এপ' : 'Unofficial citizen companion app'}
        icon={<IconInfo className="w-5 h-5"/>}
      />
      <section className="m3-card p-4 text-sm leading-relaxed text-slate-700 space-y-2">
        <p>
          {lang === 'as'
            ? 'এই এপে অসম চৰকাৰৰ ভূমি অভিলেখ সেৱা সম্পৰ্কীয় শিক্ষামূলক তথ্য আৰু সঁজুলি প্ৰদান কৰে। চৰকাৰী অভিলেখ কেৱল চৰকাৰী পৰ্টেলতেই পোৱা যায়।'
            : 'This app provides educational information and tools around Assam land-record services. The authoritative records are only on official Government portals.'}
        </p>
        <p>
          {lang === 'as'
            ? 'এপে স্ক্ৰেপিং নকৰে, কেপচা অতিক্ৰম নকৰে বা মিছা মালিকানা তথ্য তৈয়াৰ নকৰে।'
            : 'The app does not scrape, bypass CAPTCHA, or fabricate ownership data.'}
        </p>
        <p>
          {lang === 'as'
            ? 'এপৰ উৎস কোড আৰু গোপনীয়তা নীতি GitHub-ত উন্মুক্ত — সকলো তথ্যৰ উৎস ওলিখিত আছে।'
            : 'The source code and privacy policy are open on GitHub — every data source used by the app is listed there.'}
        </p>
      </section>
      <div className="flex flex-wrap gap-2">
        <OfficialLink url="https://github.com/awares2011-ship-it/assam-land-records-dharitre" label={lang === 'as' ? 'উৎস কোড' : 'Source code'} variant="ghost" />
        <OfficialLink url="https://awares2011-ship-it.github.io/assam-land-records-dharitre/privacy-policy.html" label={lang === 'as' ? 'গোপনীয়তা নীতি' : 'Privacy policy'} variant="ghost" />
        <OfficialLink url="https://ilrms.assam.gov.in/" label="ILRMS" variant="ghost" />
        <OfficialLink url="https://basundhara.assam.gov.in/" label="Mission Basundhara" variant="ghost" />
        <OfficialLink url="https://dlrs.assam.gov.in/" label="DLR Assam" variant="ghost" />
        <OfficialLink url="https://rtps.assam.gov.in/" label="RTPS Assam" variant="ghost" />
      </div>
      <Disclaimer />
    </div>
  );
}
