import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LandResult from '../components/LandResult';
import { useI18n } from '../i18n/I18nProvider';
import {
  IconSearch, IconReset, IconArrowLeft, IconInfo, IconDoc, IconMap, IconLayers,
} from '../components/Icon';
import AppLogo from '../components/AppLogo';
import { api, type FormState } from '../services/backend';

type Step = 'district' | 'circle' | 'village' | 'details';

export default function LandSearch() {
  const { lang } = useI18n();

  const [state, setState] = useState<FormState | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [captcha, setCaptcha] = useState('');
  const [busy, setBusy] = useState<'' | 'init' | 'select' | 'submit' | 'refresh'>('init');
  const [err, setErr] = useState('');
  const [step, setStep] = useState<Step>('district');
  const [showHelp, setShowHelp] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const sidRef = useRef<string>('');
  const captchaInputRef = useRef<HTMLInputElement>(null);

  // Hide the sticky bar whenever (a) the soft keyboard opens — detected via
  // visualViewport or window height delta — or (b) any text input in the
  // document has focus. Belt-and-braces because visualViewport is unreliable
  // in older Android WebViews.
  useEffect(() => {
    const vv = (window as unknown as { visualViewport?: VisualViewport }).visualViewport;
    const initialH = window.innerHeight;
    const check = () => {
      const vh = vv?.height ?? window.innerHeight;
      const diff = initialH - vh;
      const kb = diff > 150;
      const el = document.activeElement as HTMLElement | null;
      const typing = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      setKbOpen(kb || typing);
    };
    vv?.addEventListener('resize', check);
    window.addEventListener('resize', check);
    document.addEventListener('focusin',  check, true);
    document.addEventListener('focusout', check, true);
    check();
    return () => {
      vv?.removeEventListener('resize', check);
      window.removeEventListener('resize', check);
      document.removeEventListener('focusin',  check, true);
      document.removeEventListener('focusout', check, true);
    };
  }, []);

  const startSession = useCallback(async () => {
    setBusy('init');
    setErr('');
    try {
      const s = await api.session();
      sidRef.current = s.sid ?? '';
      setState(s);
      setValues({});
      setCaptcha('');
      setStep('district');
    } catch (e) {
      setErr(
        e instanceof Error && /fetch|network|connect|socket|host/i.test(e.message)
          ? (lang === 'as'
              ? 'ধৰিত্ৰী পৰ্টেললৈ যোগাযোগ নহ\'ল — আপোনাৰ ইণ্টাৰনেট সংযোগ পৰীক্ষা কৰক'
              : 'Cannot reach the Dharitree portal — check your internet connection')
          : e instanceof Error ? e.message : 'Failed to reach Dharitree',
      );
    } finally {
      setBusy('');
    }
  }, []);

  useEffect(() => { startSession(); }, [startSession]);

  const currentValue = useCallback(
    (name: string): string => values[name] ?? state?.controls.find(c => c.name === name)?.value ?? '',
    [values, state],
  );

  const nameOf = (control: 'dcode' | 'cdvcode' | 'vilcode') =>
    state?.controls.find(c => c.name === control);

  const districtCtrl = nameOf('dcode');
  const circleCtrl   = nameOf('cdvcode');
  const villageCtrl  = nameOf('vilcode');

  const districtValue = currentValue('dcode');
  const circleValue   = currentValue('cdvcode');
  const villageValue  = currentValue('vilcode');

  const districtLabel = districtCtrl?.options?.find(o => o.value === districtValue)?.text ?? '';
  const circleLabel   = circleCtrl?.options?.find(o => o.value === circleValue)?.text ?? '';
  const villageLabel  = villageCtrl?.options?.find(o => o.value === villageValue)?.text ?? '';

  const change = async (name: string, value: string, cascade: boolean, nextStep: Step | null) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (nextStep) setStep(nextStep);
    if (!cascade || !sidRef.current) return;
    setBusy('select');
    setErr('');
    try {
      const s = await api.select(sidRef.current, name, value);
      sidRef.current = s.sid ?? sidRef.current;
      setState(s);
      setCaptcha('');
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 410) { api.discard(sidRef.current); await startSession(); return; }
      setErr(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setBusy('');
    }
  };

  const refreshCaptcha = async () => {
    if (!sidRef.current) return;
    setBusy('refresh');
    try {
      const s = await api.captcha(sidRef.current);
      sidRef.current = s.sid ?? sidRef.current;
      setState(s);
      setCaptcha('');
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 410) { api.discard(sidRef.current); await startSession(); return; }
      setErr(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setBusy('');
    }
  };

  const submit = async () => {
    if (!sidRef.current) return;
    if (state?.captchaSrc && !captcha.trim()) return;
    setBusy('submit');
    setErr('');
    try {
      const toSend: Record<string, string> = {};
      for (const c of state?.controls ?? []) toSend[c.name] = currentValue(c.name);
      const s = await api.submit(sidRef.current, captcha.trim(), toSend);
      sidRef.current = s.sid ?? sidRef.current;
      setState(s);
      setCaptcha('');
      if (!s.result && s.captchaSrc) setStep('details');
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 410) { api.discard(sidRef.current); await startSession(); return; }
      setErr(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setBusy('');
    }
  };

  const reset = () => { startSession(); };

  const result = state?.result ?? null;

  // Which step index for the progress dots
  const stepsOrder: Step[] = ['district', 'circle', 'village', 'details'];
  const stepIdx = stepsOrder.indexOf(step);

  // Primary CTA label + enabled state
  const canSearch = useMemo(() => {
    if (!state) return false;
    const everySelect = state.controls.every(c => {
      if (c.type !== 'select') return true;
      const v = currentValue(c.name);
      return v !== '' && v !== '0' && v !== '-1';
    });
    if (!everySelect) return false;
    if (state.captchaSrc && !captcha.trim()) return false;
    return true;
  }, [state, captcha, currentValue]);

  const primaryLabel = (() => {
    if (busy === 'submit') return lang === 'as' ? 'অনুসন্ধান…' : 'Searching…';
    if (step === 'details') return lang === 'as' ? 'ফলাফল চাওক' : 'Fetch record';
    return lang === 'as' ? 'পৰৱৰ্তী' : 'Continue';
  })();
  const canPrimary =
    step === 'details' ? canSearch :
    step === 'district' ? !!districtValue :
    step === 'circle'   ? !!circleValue :
    step === 'village'  ? !!villageValue :
    false;

  const goPrimary = () => {
    if (step === 'district') { if (districtValue) setStep('circle'); return; }
    if (step === 'circle')   { if (circleValue)   setStep('village'); return; }
    if (step === 'village')  { if (villageValue)  submit(); return; } // triggers ROR fetch
    if (step === 'details')  submit();
  };

  // Showing result? use the full-page result view.
  if (result) {
    return (
      <div className="pb-24">
        <LandResult r={result} onBack={reset} />
      </div>
    );
  }

  return (
    // Extra bottom padding so the sticky action bar never covers the last
    // item of the picker list (nav bar ~56px + action bar ~72px + buffer).
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col pb-[160px]">
      {/* Compact top: stepper + mini-breadcrumb */}
      <Stepper
        steps={[
          { k: 'district', title: lang === 'as' ? 'জিলা' : 'District' },
          { k: 'circle',   title: lang === 'as' ? 'চক্ৰ'  : 'Circle' },
          { k: 'village',  title: lang === 'as' ? 'গাঁও'  : 'Village' },
          { k: 'details',  title: lang === 'as' ? 'বিৱৰণ' : 'Details' },
        ]}
        activeIdx={stepIdx}
        onJump={(k) => {
          if (k === 'details') return;
          if (k === 'district') setStep('district');
          if (k === 'circle' && districtValue) setStep('circle');
          if (k === 'village' && circleValue) setStep('village');
        }}
      />

      {err && (
        <div className="mb-3 rounded-xl p-3 bg-rose-50 border border-rose-100 text-sm text-rose-800">
          {err}
          <button onClick={startSession} className="ml-2 underline">retry</button>
        </div>
      )}

      {/* ONE screen: single big card for the active step */}
      <div className="flex-1">
        {step === 'district' && (
          <StepCard
            icon={<IconMap className="w-5 h-5"/>}
            tint="from-emerald-500 to-emerald-700"
            title={lang === 'as' ? 'জিলা বাছনি কৰক' : 'Pick a district'}
            subtitle={lang === 'as' ? 'অসমৰ 30+ জিলা উপলব্ধ' : '30+ Assam districts loaded live'}
          >
            <SearchSelect
              placeholder={lang === 'as' ? 'জিলা সন্ধান…' : 'Search districts…'}
              options={districtCtrl?.options ?? []}
              value={districtValue}
              onPick={(v) => change('dcode', v, true, 'circle')}
              busy={busy === 'select'}
            />
          </StepCard>
        )}
        {step === 'circle' && (
          <StepCard
            icon={<IconLayers className="w-5 h-5"/>}
            tint="from-sky-500 to-sky-700"
            title={lang === 'as' ? 'ৰাজহ চক্ৰ' : 'Pick a revenue circle'}
            subtitle={districtLabel || ''}
          >
            {busy === 'select' && !circleCtrl?.options?.length ? (
              <LoadingList label={lang === 'as' ? 'চক্ৰ আনি আছে…' : 'Loading circles…'} />
            ) : (
              <SearchSelect
                placeholder={lang === 'as' ? 'চক্ৰ সন্ধান…' : 'Search circles…'}
                options={circleCtrl?.options ?? []}
                value={circleValue}
                onPick={(v) => change('cdvcode', v, true, 'village')}
                busy={busy === 'select'}
                empty={lang === 'as' ? 'জিলা বাছনিৰ অপেক্ষাত' : 'Pick a district first'}
              />
            )}
          </StepCard>
        )}
        {step === 'village' && (
          <StepCard
            icon={<IconMap className="w-5 h-5"/>}
            tint="from-violet-500 to-violet-700"
            title={lang === 'as' ? 'গাঁও বা চহৰ' : 'Pick a village or town'}
            subtitle={[districtLabel, circleLabel].filter(Boolean).join(' · ')}
          >
            {busy === 'select' && !villageCtrl?.options?.length ? (
              <LoadingList label={lang === 'as' ? 'গাঁও আনি আছে…' : 'Loading villages…'} />
            ) : (
              <SearchSelect
                placeholder={lang === 'as' ? 'গাঁও সন্ধান…' : 'Search villages…'}
                options={villageCtrl?.options ?? []}
                value={villageValue}
                onPick={(v) => change('vilcode', v, false, 'village')}
                busy={busy === 'select'}
                empty={lang === 'as' ? 'চক্ৰ বাছনিৰ অপেক্ষাত' : 'Pick a circle first'}
              />
            )}
          </StepCard>
        )}
        {step === 'details' && (
          <StepCard
            icon={<IconDoc className="w-5 h-5"/>}
            tint="from-amber-500 to-amber-700"
            title={lang === 'as' ? 'দাগ আৰু কেপচা' : 'Dag number & CAPTCHA'}
            subtitle={[districtLabel, circleLabel, villageLabel].filter(Boolean).join(' · ')}
          >
            {/* Dag input */}
            {state?.controls
              .filter(c => c.type === 'text' || (c.type === 'select' && !['dcode','cdvcode','vilcode'].includes(c.name)))
              .map(c => (
                <div key={c.id} className="mb-3">
                  <label className="label" htmlFor={`f_${c.id}`}>{c.label}</label>
                  {c.type === 'select' ? (
                    <select
                      id={`f_${c.id}`}
                      className="input"
                      value={currentValue(c.name)}
                      onChange={(e) => setValues(p => ({ ...p, [c.name]: e.target.value }))}
                    >
                      {c.options?.map((o, i) => <option key={i} value={o.value}>{o.text}</option>)}
                    </select>
                  ) : (
                    <input
                      id={`f_${c.id}`}
                      className="input text-lg font-medium"
                      value={currentValue(c.name)}
                      onChange={(e) => setValues(p => ({ ...p, [c.name]: e.target.value }))}
                      placeholder={lang === 'as' ? 'দাগ নং…' : 'Enter dag number…'}
                      inputMode="numeric"
                    />
                  )}
                </div>
              ))}

            {/* CAPTCHA — stacked: image + refresh on top, full-width input below */}
            {state?.captchaSrc && (
              <div>
                <label className="label flex items-center justify-between">
                  <span>CAPTCHA</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {lang === 'as' ? 'ছবিত থকা অক্ষৰ দিয়ক' : 'Type the characters above'}
                  </span>
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {state.captcha ? (
                    <img
                      src={state.captcha}
                      alt="CAPTCHA from Dharitree"
                      className="h-14 flex-1 min-w-0 object-contain rounded-lg bg-white border border-slate-200 px-2"
                    />
                  ) : (
                    <div className="h-14 flex-1 rounded-lg bg-slate-100 border border-slate-200 grid place-items-center text-xs text-slate-500">
                      …
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    disabled={busy !== ''}
                    className="h-14 w-14 shrink-0 rounded-xl bg-brand-50 text-brand-700 grid place-items-center"
                    aria-label={lang === 'as' ? 'নতুন কেপচা' : 'New CAPTCHA'}
                  >
                    <IconReset className="w-5 h-5"/>
                  </button>
                </div>
                <input
                  ref={captchaInputRef}
                  className="input w-full h-12 text-center text-lg tracking-[0.4em] font-mono uppercase"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value.toUpperCase())}
                  onFocus={(e) => {
                    // Keep the input visible when the mobile keyboard opens
                    setTimeout(() => e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250);
                  }}
                  placeholder="ABCDE"
                  maxLength={8}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {state.message && (
                  <p className="mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-2 py-1.5">
                    {state.message}
                  </p>
                )}

                {/* Inline Search button — guarantees a tap target when the soft
                    keyboard hides the sticky bottom bar. */}
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSearch || busy !== ''}
                  className="btn-primary w-full h-12 text-base mt-3 disabled:opacity-50"
                >
                  <IconSearch className="w-5 h-5"/>
                  {busy === 'submit'
                    ? (lang === 'as' ? 'অনুসন্ধান…' : 'Searching…')
                    : (lang === 'as' ? 'ফলাফল চাওক' : 'Fetch record')}
                </button>
              </div>
            )}
          </StepCard>
        )}
      </div>

      {/* Sticky bottom action bar — hidden while the soft keyboard is open */}
      <div
        className={
          'fixed left-0 right-0 bottom-14 z-10 safe-bottom transition-opacity ' +
          (kbOpen ? 'opacity-0 pointer-events-none' : 'opacity-100')
        }
      >
        <div className="max-w-xl mx-auto px-4 pb-2 pt-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const i = stepsOrder.indexOf(step);
                if (i > 0) setStep(stepsOrder[i - 1]);
              }}
              className="btn-ghost w-14"
              aria-label="Back"
              disabled={stepsOrder.indexOf(step) === 0}
            >
              <IconArrowLeft className="w-4 h-4"/>
            </button>
            <button
              type="button"
              onClick={goPrimary}
              disabled={!canPrimary || busy !== ''}
              className="btn-primary flex-1 h-12 text-base disabled:opacity-50 shadow-pop"
            >
              {step === 'details' ? <IconSearch className="w-5 h-5"/> : null}
              {primaryLabel}
            </button>
            <button
              type="button"
              onClick={reset}
              className="btn-ghost w-14"
              aria-label={lang === 'as' ? 'পুনৰায়' : 'Reset'}
            >
              <IconReset className="w-4 h-4"/>
            </button>
          </div>

          {/* Mini help toggle */}
          <button
            type="button"
            onClick={() => setShowHelp(v => !v)}
            className="w-full mt-1 text-[11px] text-slate-500 flex items-center justify-center gap-1 py-0.5"
          >
            <IconInfo className="w-3 h-3"/>
            {showHelp
              ? (lang === 'as' ? 'নিৰ্দেশনা লুকুৱাওক' : 'Hide help')
              : (lang === 'as' ? 'ই কেনেকৈ কাম কৰে?' : 'How does this work?')}
          </button>
          {showHelp && (
            <p className="mt-1 text-[11px] text-slate-500 bg-white/90 backdrop-blur rounded-lg border border-slate-100 p-2 leading-snug">
              {lang === 'as'
                ? 'এই এপে চৰকাৰী ধৰিত্ৰী পৰ্টেলৰ পৰাই লাইভ তথ্য আনে। আপুনি কেপচা পূৰণ কৰাৰ পাছত অভিলেখ এই এপতে দেখুৱা হয় — ছবি বা পি ডি এফ হিচাপে ডাউনল\'ড কৰিব পাৰে।'
                : 'The app fetches live data from the official Dharitree portal. After you solve the CAPTCHA, the record is rendered natively here — download it as PNG or PDF.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----- UI building blocks ----- */

function Stepper({
  steps, activeIdx, onJump,
}: {
  steps: { k: Step; title: string }[];
  activeIdx: number;
  onJump: (k: Step) => void;
}) {
  return (
    <ol className="mb-3 grid grid-cols-4 gap-1.5" aria-label="Steps">
      {steps.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <li key={s.k}>
            <button
              type="button"
              onClick={() => onJump(s.k)}
              className="w-full flex flex-col items-center gap-1 group"
            >
              <span
                className={
                  'w-7 h-7 rounded-full text-xs font-semibold grid place-items-center border transition ' +
                  (active
                    ? 'bg-brand-600 text-white border-brand-600 ring-4 ring-brand-100'
                    : done
                      ? 'bg-brand-100 text-brand-700 border-brand-100'
                      : 'bg-white text-slate-400 border-slate-200')
                }
                aria-current={active ? 'step' : undefined}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={
                  'text-[10px] font-medium truncate max-w-full ' +
                  (active ? 'text-brand-700' : done ? 'text-slate-600' : 'text-slate-400')
                }
              >
                {s.title}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StepCard({
  icon, tint, title, subtitle, children,
}: {
  icon: React.ReactNode;
  tint: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white shadow-pop border border-slate-100 overflow-hidden">
      <header className={`p-4 flex items-center gap-3 bg-gradient-to-br text-white ${tint}`}>
        <div className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-tight">{title}</h2>
          {subtitle ? <p className="text-[11px] text-white/90 truncate">{subtitle}</p> : null}
        </div>
        <AppLogo className="w-7 h-7 ml-auto rounded-lg opacity-80 border border-white/30"/>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function LoadingList({ label }: { label: string }) {
  return (
    <div className="py-10 flex flex-col items-center gap-3 text-slate-500 text-sm">
      <span className="inline-block w-7 h-7 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
      {label}
    </div>
  );
}

/**
 * Picker with inline filter, large tappable list, chosen value highlighted.
 * Used in place of a native <select> for a far nicer mobile experience.
 */
function SearchSelect({
  placeholder, options, value, onPick, busy, empty,
}: {
  placeholder: string;
  options: { value: string; text: string }[];
  value: string;
  onPick: (v: string) => void;
  busy?: boolean;
  empty?: string;
}) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    const real = options.filter(o => o.value !== ''); // drop the Select… placeholder row
    if (!n) return real;
    return real.filter(o => o.text.toLowerCase().includes(n));
  }, [options, q]);

  if (!options.length) {
    return (
      <p className="text-sm text-slate-500 py-6 text-center">
        {empty ?? 'No options'}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="input pl-9"
        />
      </div>
      <ul
        className={
          'rounded-xl border border-slate-100 bg-slate-50/50 divide-y divide-slate-100 overflow-y-auto ' +
          // Smaller cap when the keyboard / sticky bar reduces usable height.
          'max-h-[42vh]'
        }
      >
        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-slate-500">—</li>
        )}
        {filtered.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              disabled={busy}
              onClick={() => onPick(o.value)}
              className={
                'w-full text-left px-3 py-3 text-sm font-medium transition flex items-center gap-2 ' +
                (o.value === value
                  ? 'bg-brand-50 text-brand-900'
                  : 'bg-white text-slate-800 active:bg-slate-50')
              }
            >
              <span
                className={
                  'w-5 h-5 rounded-full grid place-items-center border ' +
                  (o.value === value
                    ? 'bg-brand-600 border-brand-600 text-white text-[11px]'
                    : 'border-slate-300')
                }
              >
                {o.value === value ? '✓' : ''}
              </span>
              <span className="flex-1">{o.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
