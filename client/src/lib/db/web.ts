import { openDB, IDBPDatabase } from 'idb';
import { CalendarEntry, Note, Person } from './schema';

let dbp: IDBPDatabase | null = null;

export async function initWebDB() {
  if (!dbp) {
    dbp = await openDB('soulhealing', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('calendar_entries')) {
          const store = db.createObjectStore('calendar_entries', { keyPath: 'id', autoIncrement: true });
          store.createIndex('by_exercise', 'exerciseId');
          store.createIndex('by_date', 'date');
        }
        if (!db.objectStoreNames.contains('notes')) {
          const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
          store.createIndex('by_exercise', 'exerciseId');
        }
        if (!db.objectStoreNames.contains('people')) {
          const store = db.createObjectStore('people', { keyPath: 'id', autoIncrement: true });
          store.createIndex('by_exercise', 'exerciseId');
          store.createIndex('by_name', 'name');
        }
      },
    });
  }
  return dbp;
}

// Calendar
export async function addCalendarEntryWeb(entry: Omit<CalendarEntry, 'id' | 'created_at' | 'updated_at'>) {
  const db = await initWebDB();
  await db.add('calendar_entries', { ...entry, created_at: new Date().toISOString() });
}
export async function listCalendarEntriesWeb(opts: { exerciseId?: number; from?: string; to?: string } = {}) {
  const db = await initWebDB();
  const store = db.transaction('calendar_entries').store;
  const all = await store.getAll() as CalendarEntry[];
  let out = all;
  if (typeof opts.exerciseId === 'number') out = out.filter(r => r.exerciseId === opts.exerciseId);
  if (opts.from && opts.to) out = out.filter(r => r.date >= opts.from! && r.date <= opts.to!);
  return out.sort((a, b) => (b.date + (b.id || 0)).localeCompare(a.date + (a.id || 0)));
}

// Notes
export async function addNoteWeb(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
  const db = await initWebDB();
  await db.add('notes', { ...note, created_at: new Date().toISOString() });
}
export async function listNotesWeb(exerciseId: number) {
  const db = await initWebDB();
  const idx = db.transaction('notes').store.index('by_exercise');
  const res = await idx.getAll(exerciseId) as Note[];
  return res.sort((a, b) => (b.id! - a.id!));
}
export async function deleteNoteWeb(id: number) {
  const db = await initWebDB();
  await db.delete('notes', id);
}

// People
export async function addPersonWeb(p: Omit<Person, 'id' | 'created_at' | 'updated_at'>) {
  const db = await initWebDB();
  await db.add('people', { ...p, forgiven: !!p.forgiven, created_at: new Date().toISOString() });
}
export async function listPeopleWeb(exerciseId: number) {
  const db = await initWebDB();
  const idx = db.transaction('people').store.index('by_exercise');
  const res = await idx.getAll(exerciseId) as Person[];
  return res.sort((a, b) => a.name.localeCompare(b.name));
}
export async function updatePersonForgivenessWeb(id: number, forgiven: boolean) {
  const db = await initWebDB();
  const p = await db.get('people', id) as Person | undefined;
  if (!p) return;
  await db.put('people', { ...p, forgiven });
}
export async function deletePersonWeb(id: number) {
  const db = await initWebDB();
  await db.delete('people', id);
}

// Export / Import
export async function exportJSONWeb() {
  const db = await initWebDB();
  const [calendar_entries, notes, people] = await Promise.all([
    db.getAll('calendar_entries') as Promise<CalendarEntry[]>,
    db.getAll('notes') as Promise<Note[]>,
    db.getAll('people') as Promise<Person[]>,
  ]);
  return JSON.stringify({ calendar_entries, notes, people }, null, 2);
}
export async function downloadBackup(jsonString: string) {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `soulhealing-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
export async function importJSONWeb(jsonString: string) {
  const db = await initWebDB();
  const data = JSON.parse(jsonString);
  const tx = db.transaction(['calendar_entries', 'notes', 'people'], 'readwrite');
  await Promise.all([
    tx.objectStore('calendar_entries').clear(),
    tx.objectStore('notes').clear(),
    tx.objectStore('people').clear(),
  ]);
  for (const r of data.calendar_entries || []) await tx.objectStore('calendar_entries').put(r);
  for (const n of data.notes || []) await tx.objectStore('notes').put(n);
  for (const p of data.people || []) await tx.objectStore('people').put(p);
  await tx.done;
}