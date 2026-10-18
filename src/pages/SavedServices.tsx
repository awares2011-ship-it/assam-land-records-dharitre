import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useI18n } from '../i18n/I18nProvider';
import { list, remove, type Saved } from '../components/Favorites';
import { IconBookmark } from '../components/Icon';

export default function SavedServices() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<Saved[]>([]);

  useEffect(() => { setItems(list()); }, []);

  const doRemove = (id: string) => {
    remove(id);
    setItems(list());
  };

  return (
    <div className="space-y-4">
      <PageHeader title={t('svc.saved')} icon={<IconBookmark className="w-5 h-5"/>} />
      {items.length === 0 && (
        <div className="m3-card p-5 text-sm text-slate-500 text-center">
          {lang === 'as' ? 'সংৰক্ষিত সেৱা নাই।' : 'No saved services yet.'}
        </div>
      )}
      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id} className="m3-card p-3 flex items-center gap-3">
            <Link to={it.path} className="flex-1 text-sm font-medium text-slate-800">{it.title}</Link>
            <button onClick={() => doRemove(it.id)} className="text-xs text-rose-600 font-medium px-2 py-1 rounded-md hover:bg-rose-50">
              {lang === 'as' ? 'আঁতৰাওক' : 'Remove'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
