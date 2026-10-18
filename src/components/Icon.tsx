import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.8,
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

type P = { className?: string };

export const IconHome      = (p:P) => <svg {...base} className={p.className}><path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/></svg>;
export const IconSearch    = (p:P) => <svg {...base} className={p.className}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
export const IconLayers    = (p:P) => <svg {...base} className={p.className}><path d="M12 3l9 5-9 5-9-5 9-5zM3 14l9 5 9-5M3 19l9 5 9-5"/></svg>;
export const IconNews      = (p:P) => <svg {...base} className={p.className}><path d="M4 6h12a3 3 0 013 3v9a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM8 9h8M8 13h8M8 17h5"/></svg>;
export const IconMore      = (p:P) => <svg {...base} className={p.className}><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>;
export const IconCalc      = (p:P) => <svg {...base} className={p.className}><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 7h8M8 11h2M12 11h4M8 15h2M12 15h4M8 19h8"/></svg>;
export const IconWeather   = (p:P) => <svg {...base} className={p.className}><path d="M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18H7z"/></svg>;
export const IconScheme    = (p:P) => <svg {...base} className={p.className}><path d="M4 6a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/><path d="M14 4v6h6M9 14h6M9 18h4"/></svg>;
export const IconMarket    = (p:P) => <svg {...base} className={p.className}><path d="M3 8l2-4h14l2 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/><path d="M3 8h18M9 12v6M15 12v6"/></svg>;
export const IconMap       = (p:P) => <svg {...base} className={p.className}><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v16M15 6v16"/></svg>;
export const IconBookmark  = (p:P) => <svg {...base} className={p.className}><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>;
export const IconHelp      = (p:P) => <svg {...base} className={p.className}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 014.8.5c0 1.6-2.3 2-2.3 3.5M12 17v.01"/></svg>;
export const IconDoc       = (p:P) => <svg {...base} className={p.className}><path d="M7 3h8l4 4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>;
export const IconExternal  = (p:P) => <svg {...base} className={p.className}><path d="M14 4h6v6M20 4L10 14M14 20H6a2 2 0 01-2-2V8"/></svg>;
export const IconGlobe     = (p:P) => <svg {...base} className={p.className}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>;
export const IconArrowLeft = (p:P) => <svg {...base} className={p.className}><path d="M20 12H4M10 6l-6 6 6 6"/></svg>;
export const IconReset     = (p:P) => <svg {...base} className={p.className}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>;
export const IconSwap      = (p:P) => <svg {...base} className={p.className}><path d="M7 7h13l-3-3M17 17H4l3 3"/></svg>;
export const IconCopy      = (p:P) => <svg {...base} className={p.className}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>;
export const IconShare     = (p:P) => <svg {...base} className={p.className}><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.6 10.6l6.8-3.2M8.6 13.4l6.8 3.2"/></svg>;
export const IconLang      = (p:P) => <svg {...base} className={p.className}><path d="M4 6h10M9 6v12M4 10h10M14 18l5-10 5 10M16 14h6"/></svg>;
export const IconSettings  = (p:P) => <svg {...base} className={p.className}><circle cx="12" cy="12" r="3"/><path d="M19.4 12.9l1.6-.9-1.6-2.8-1.8.5a7 7 0 00-1.6-.9L15.5 7h-3.2l-.5 1.8a7 7 0 00-1.6.9l-1.8-.5L6.8 12l1.6.9a7 7 0 000 1.8L6.8 15.6l1.6 2.8 1.8-.5a7 7 0 001.6.9l.5 1.8h3.2l.5-1.8a7 7 0 001.6-.9l1.8.5 1.6-2.8-1.6-.9a7 7 0 000-1.8z"/></svg>;
export const IconInfo      = (p:P) => <svg {...base} className={p.className}><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/></svg>;
export const IconLeaf      = (p:P) => <svg {...base} className={p.className}><path d="M4 20c0-8 6-14 16-14 0 10-6 16-16 16z"/><path d="M4 20L15 9"/></svg>;
export const IconDownload  = (p:P) => <svg {...base} className={p.className}><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></svg>;
export const IconImage     = (p:P) => <svg {...base} className={p.className}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M3 17l5-5 4 4 3-3 6 6"/></svg>;
export const IconPdf       = (p:P) => <svg {...base} className={p.className}><path d="M7 3h8l4 4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M14 3v5h5"/><text x="7" y="18" fontSize="5.5" fontWeight="700" fill="currentColor" stroke="none">PDF</text></svg>;
export const IconPrint     = (p:P) => <svg {...base} className={p.className}><path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z"/></svg>;
export const IconStar      = (p:P) => <svg {...base} className={p.className}><path d="M12 3l2.9 6 6.6.9-4.8 4.7 1.1 6.6L12 18l-5.8 3.1 1.1-6.6L2.5 9.9 9.1 9z"/></svg>;
export const IconFire      = (p:P) => <svg {...base} className={p.className}><path d="M12 3c3 4 6 6 6 10a6 6 0 11-12 0c0-2 1-3 2-4 0 2 1 3 2 3-1-3 1-5 2-9z"/></svg>;
export const IconBolt      = (p:P) => <svg {...base} className={p.className}><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/></svg>;
