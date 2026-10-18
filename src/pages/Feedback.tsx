import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { openOfficial } from '../components/OfficialLink';
import { IconHelp } from '../components/Icon';

export default function Feedback() {
  const { lang } = useI18n();
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');

  const subject = encodeURIComponent('Assam Dharitree App Feedback');
  const body = encodeURIComponent(
    `From: ${email}\n\n${text}\n\n— sent from Assam Dharitree companion app`,
  );
  const mailto = `mailto:feedback@example.org?subject=${subject}&body=${body}`;

  return (
    <div className="space-y-4">
      <PageHeader
        title={lang === 'as' ? 'মতামত দিয়ক' : 'Feedback'}
        subtitle={lang === 'as' ? 'আপোনাৰ মতামত আদৰণীয়' : 'Your feedback helps us improve'}
        icon={<IconHelp className="w-5 h-5"/>}
      />
      <section className="m3-card p-4 space-y-3">
        <div>
          <label className="label">{lang === 'as' ? 'আপোনাৰ ইমেইল (ঐচ্ছিক)' : 'Your email (optional)'}</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="label">{lang === 'as' ? 'আপোনাৰ মতামত' : 'Your message'}</label>
          <textarea
            className="input min-h-[140px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={lang === 'as' ? 'এপৰ বিষয়ে আপোনাৰ মত…' : 'What would you like to tell us?'}
          />
        </div>
        <button
          type="button"
          disabled={!text.trim()}
          onClick={() => openOfficial(mailto)}
          className="btn-primary w-full disabled:opacity-50"
        >
          {lang === 'as' ? 'ইমেইলৰে পঠিয়াওক' : 'Send via email'}
        </button>
        <p className="text-[11px] text-slate-500 text-center">
          {lang === 'as'
            ? 'এপে আপোনাৰ তথ্য সংৰক্ষণ নকৰে — ইমেইল এপেহে বাৰ্তা পঠাব।'
            : 'The app does not store your input — your email app sends the message.'}
        </p>
      </section>
    </div>
  );
}
