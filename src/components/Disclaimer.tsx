import { useI18n } from '../i18n/I18nProvider';
import { IconInfo } from './Icon';

export default function Disclaimer({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  return (
    <div className={`m3-card p-3 flex items-start gap-2 bg-amber-50 border-amber-100 ${className}`}>
      <IconInfo className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-900 leading-relaxed">{t('common.disclaimer')}</p>
    </div>
  );
}
