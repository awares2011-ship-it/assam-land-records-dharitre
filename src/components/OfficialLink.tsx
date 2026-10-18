import { Browser } from '@capacitor/browser';
import { useI18n } from '../i18n/I18nProvider';
import { IconExternal } from './Icon';

export async function openOfficial(url: string) {
  try {
    // On Android/iOS this uses the system in-app browser; on web it opens a new tab.
    await Browser.open({ url, presentationStyle: 'popover', windowName: '_blank' });
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export default function OfficialLink({
  url,
  label,
  variant = 'primary',
}: {
  url: string;
  label?: string;
  variant?: 'primary' | 'ghost';
}) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => openOfficial(url)}
      className={variant === 'primary' ? 'btn-primary' : 'btn-ghost'}
    >
      <IconExternal className="w-4 h-4" />
      {label ?? t('common.open_portal')}
    </button>
  );
}
