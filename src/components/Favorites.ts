const KEY = 'ad.saved';

export type Saved = { id: string; title: string; path: string; createdAt: number };

export function list(): Saved[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved[]) : [];
  } catch {
    return [];
  }
}

export function has(id: string): boolean {
  return list().some(s => s.id === id);
}

export function toggle(entry: Omit<Saved, 'createdAt'>): boolean {
  const items = list();
  const idx = items.findIndex(i => i.id === entry.id);
  if (idx >= 0) {
    items.splice(idx, 1);
    localStorage.setItem(KEY, JSON.stringify(items));
    return false;
  }
  items.push({ ...entry, createdAt: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(items));
  return true;
}

export function remove(id: string): void {
  const items = list().filter(i => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(items));
}
