import { useRef, useState } from 'react';
import type { ParsedRecord } from '../services/backend';
import { useI18n } from '../i18n/I18nProvider';
import { downloadPng, downloadPdf } from '../services/exportResult';
import {
  IconCopy, IconShare, IconDownload, IconImage, IconPdf, IconPrint,
} from './Icon';
import AppLogo from './AppLogo';

export default function LandResult({ r, onBack }: { r: ParsedRecord; onBack: () => void }) {
  const { t, lang } = useI18n();
  const captureRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<'' | 'png' | 'pdf'>('');
  const [toast, setToast] = useState<string>('');

  const stamp = (() => {
    const d = new Date();
    return d.toISOString().slice(0, 10) + '-' + String(d.getHours()).padStart(2,'0') + String(d.getMinutes()).padStart(2,'0');
  })();
  const slug = (r.title || 'land-record').replace(/[^\wঀ-৿-]+/g, '_').slice(0, 40);
  const baseName = `dharitree-${slug}-${stamp}`;

  const doDownload = async (kind: 'png' | 'pdf') => {
    if (!captureRef.current || busy) return;
    setBusy(kind);
    try {
      const name = `${baseName}.${kind}`;
      const uri = kind === 'png'
        ? await downloadPng(captureRef.current, { filename: name })
        : await downloadPdf(captureRef.current, { filename: name });
      // On native, uri is set; on web the browser handled the download.
      const where = uri ? uri.replace(/^.*\//, 'Documents/') : name;
      setToast(
        (lang === 'hi' ? 'सहेजा गया: '
         : lang === 'as' ? 'সংৰক্ষণ কৰা হ\'ল: '
         : 'Saved: ') + where,
      );
      window.setTimeout(() => setToast(''), 4000);
    } catch (e) {
      setToast(
        (lang === 'hi' ? 'सहेजना विफल: '
         : lang === 'as' ? 'সংৰক্ষণ বিফল: '
         : 'Save failed: ') + (e instanceof Error ? e.message : 'unknown'),
      );
      window.setTimeout(() => setToast(''), 4000);
    } finally {
      setBusy('');
    }
  };

  const doPrint = () => window.print();

  const copyAll = async () => {
    const txt =
      (r.title ? r.title + '\n\n' : '') +
      r.fields.map(f => `${f.label}: ${f.value}`).join('\n') +
      (r.tables.length ? '\n\n' + r.tables.map(tb =>
        [tb.headers.join('\t'), ...tb.rows.map(x => x.join('\t'))].join('\n')).join('\n\n') : '');
    try { await navigator.clipboard.writeText(txt); } catch { /* ignore */ }
  };

  const share = async () => {
    try {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (nav.share) {
        await nav.share({
          title: r.title ?? (lang === 'as' ? 'ভূমি অভিলেখ' : 'Land record'),
          text: r.fields.map(f => `${f.label}: ${f.value}`).join('\n'),
          url: r.source,
        });
      }
    } catch { /* cancelled */ }
  };

  return (
    <div className="space-y-3 print-area relative">
      {/* Toast banner — confirms download or shows save errors */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 bottom-24 z-30 max-w-[90vw] bg-slate-900 text-white text-xs px-4 py-2.5 rounded-full shadow-pop flex items-center gap-2 animate-fade-in"
        >
          <span className="text-emerald-400">✓</span>
          <span className="truncate">{toast}</span>
        </div>
      )}
      {/* Big download toolbar — PNG (emerald), PDF (rose), Print (slate) */}
      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 print:hidden">
        <button
          type="button"
          onClick={() => doDownload('png')}
          disabled={!!busy}
          className="relative overflow-hidden h-12 rounded-2xl font-semibold text-white bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-pop disabled:opacity-60 active:scale-[0.98] flex items-center justify-center gap-2"
          aria-label="Download PNG"
        >
          <IconImage className="w-5 h-5"/>
          {busy === 'png'
            ? (lang === 'as' ? 'তৈয়াৰ হৈ আছে…' : 'Preparing…')
            : <>PNG <span className="text-[10px] font-normal opacity-80 hidden sm:inline">image</span></>}
        </button>
        <button
          type="button"
          onClick={() => doDownload('pdf')}
          disabled={!!busy}
          className="relative overflow-hidden h-12 rounded-2xl font-semibold text-white bg-gradient-to-br from-rose-500 to-rose-700 shadow-pop disabled:opacity-60 active:scale-[0.98] flex items-center justify-center gap-2"
          aria-label="Download PDF"
        >
          <IconPdf className="w-5 h-5"/>
          {busy === 'pdf'
            ? (lang === 'as' ? 'তৈয়াৰ হৈ আছে…' : 'Preparing…')
            : <>PDF <span className="text-[10px] font-normal opacity-80 hidden sm:inline">doc</span></>}
        </button>
        <button
          type="button"
          onClick={doPrint}
          className="h-12 w-12 rounded-2xl bg-slate-900 text-white shadow-pop grid place-items-center active:scale-[0.98]"
          aria-label="Print"
        >
          <IconPrint className="w-5 h-5"/>
        </button>
      </div>

      {/* Capture surface — this exact DOM is what the PNG/PDF snapshot renders */}
      <article
        ref={captureRef}
        className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-pop"
        itemScope
        itemType="https://schema.org/GovernmentService"
      >
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 text-white p-5">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="flex items-center gap-3">
            <AppLogo className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20" />

            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-tight" itemProp="name">
                {r.title || (lang === 'as' ? 'জমাবন্দী' : 'Jamabandi record')}
              </h2>
              <p className="text-xs text-brand-100 mt-0.5">
                {lang === 'as' ? 'অসম ভূমি অভিলেখ — ILRMS Dharitree' : 'Assam Land Records — ILRMS Dharitree'}
              </p>
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-y-0.5 text-[11px] text-brand-100">
            <dt>{t('common.source')}</dt>
            <dd className="text-right text-white truncate">ilrms.assam.gov.in</dd>
            <dt>{t('common.last_updated')}</dt>
            <dd className="text-right text-white">{new Date(r.fetchedAt).toLocaleString()}</dd>
          </dl>
        </header>

        {/* Key / value panel */}
        {r.fields.length > 0 && (
          <section className="divide-y divide-slate-100">
            {r.fields.map((f, i) => (
              <div key={i} className="px-4 py-3 flex gap-3">
                <dt className="min-w-[40%] text-xs uppercase tracking-wide text-slate-500 font-medium">{f.label}</dt>
                <dd className="flex-1 text-sm text-slate-900 whitespace-pre-wrap break-words font-medium">
                  {f.value || '—'}
                </dd>
              </div>
            ))}
          </section>
        )}

        {/* Normalised tables */}
        {r.tables.map((tb, i) => (
          <section key={i} className="border-t border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {tb.headers.map((h, j) => (
                      <th key={j} className="px-3 py-2 text-left font-semibold text-slate-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tb.rows.map((row, j) => (
                    <tr key={j} className="border-t border-slate-100">
                      {row.map((cell, k) => (
                        <td key={k} className="px-3 py-2 text-slate-800 align-top">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Rich HTML snippet (jamabandi report) */}
        {r.html && (
          <section className="border-t border-slate-100 bg-white">
            <div className="overflow-x-auto">
              <div
                className="jamabandi"
                /* Backend already stripped scripts/styles/handlers/images. */
                dangerouslySetInnerHTML={{ __html: r.html }}
              />
            </div>
          </section>
        )}

        {!r.fields.length && !r.tables.length && !r.html && r.text && (
          <section className="p-4 text-sm text-slate-700 whitespace-pre-wrap">
            {r.text}
          </section>
        )}

        {/* Footer stamp inside the capture so PNG / PDF carry it */}
        <footer className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Powered by Dharitree · ilrms.assam.gov.in</span>
          <span>{new Date(r.fetchedAt).toLocaleDateString()}</span>
        </footer>
      </article>

      {/* Secondary actions, hidden from capture / print */}
      <div className="flex gap-2 print:hidden">
        <button className="btn-ghost flex-1" onClick={copyAll}>
          <IconCopy className="w-4 h-4"/>{t('common.copy')}
        </button>
        <button className="btn-ghost flex-1" onClick={share}>
          <IconShare className="w-4 h-4"/>{t('common.share')}
        </button>
        <button className="btn-ghost flex-1" onClick={onBack}>
          <IconDownload className="w-4 h-4 rotate-180"/>
          {lang === 'as' ? 'নতুন সন্ধান' : 'New search'}
        </button>
      </div>
    </div>
  );
}
