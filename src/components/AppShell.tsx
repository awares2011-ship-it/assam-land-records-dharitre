import type { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { IconHome, IconSearch, IconScheme, IconNews, IconMore, IconLang, IconArrowLeft } from './Icon';
import AppLogo from './AppLogo';

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs ${
    isActive ? 'text-brand-700' : 'text-slate-500'
  }`;

export default function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useI18n();
  const nav = useNavigate();
  const loc = useLocation();
  const isHome = loc.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="safe-top sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-xl mx-auto px-4 pb-3 pt-1 flex items-center gap-3">
          {!isHome ? (
            <button
              onClick={() => nav(-1)}
              aria-label={t('common.back')}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <IconArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <AppLogo className="w-9 h-9" />
          )}
          <div className="flex-1 leading-tight">
            <div className="text-[15px] font-semibold text-slate-900">{t('app.title')}</div>
            <div className="text-[11px] text-slate-500">{t('app.subtitle')}</div>
          </div>
          <button
            onClick={() => setLang(lang === 'en' ? 'as' : lang === 'as' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            aria-label="Toggle language"
            title={lang === 'en' ? 'Switch to Assamese' : lang === 'as' ? 'হিন্দীলৈ সলনি কৰক' : 'अंग्रेज़ी में बदलें'}
          >
            <IconLang className="w-4 h-4 text-brand-600" />
            <span className="min-w-[1.5rem] text-center">
              {lang === 'en' ? 'অ' : lang === 'as' ? 'हि' : 'EN'}
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div
          className="max-w-xl mx-auto px-4 py-4"
          style={{ paddingBottom: 'calc(6rem + var(--ad-banner-h, 0px))' }}
        >
          {children}
        </div>
      </main>

      <nav
        className="safe-bottom fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-slate-100"
        style={{ bottom: 'var(--ad-banner-h, 0px)' }}
        aria-label="Primary"
      >
        <div className="max-w-xl mx-auto flex">
          <NavLink to="/" end className={tabClass}>
            <IconHome className="w-5 h-5" />
            <span>{t('nav.home')}</span>
          </NavLink>
          <NavLink to="/land-search" className={tabClass}>
            <IconSearch className="w-5 h-5" />
            <span>{t('nav.search')}</span>
          </NavLink>
          <NavLink to="/schemes" className={tabClass}>
            <IconScheme className="w-5 h-5" />
            <span>{t('nav.schemes')}</span>
          </NavLink>
          <NavLink to="/news" className={tabClass}>
            <IconNews className="w-5 h-5" />
            <span>{t('nav.news')}</span>
          </NavLink>
          <NavLink to="/settings" className={tabClass}>
            <IconMore className="w-5 h-5" />
            <span>{t('nav.more')}</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
