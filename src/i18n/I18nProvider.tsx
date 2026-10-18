import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { t as translate, type Lang } from './translations';

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  isAssamese: boolean;
  isHindi: boolean;
};

const I18nCtx = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'ad.lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'as' || saved === 'hi') return saved;
    } catch { /* ignore */ }
    return 'en';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.classList.toggle('lang-as', lang === 'as');
    document.body.classList.toggle('lang-hi', lang === 'hi');
  }, [lang]);

  const value = useMemo<I18nValue>(() => ({
    lang,
    setLang,
    t: (k: string) => translate(k, lang),
    isAssamese: lang === 'as',
    isHindi: lang === 'hi',
  }), [lang, setLang]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): I18nValue {
  const v = useContext(I18nCtx);
  if (!v) throw new Error('useI18n must be used inside I18nProvider');
  return v;
}
