import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { CalendarEntry, Note, Person, SCHEMA_SQL } from './schema';

const DB_NAME = 'soulhealing';
let sqlite: SQLiteConnection | null = null;
let db: SQLiteDBConnection | null = null;

export async function initNativeDB() {
  if (!Capacitor.isNativePlatform()) return null;
  if (!sqlite) sqlite = new SQLiteConnection(CapacitorSQLite);
  if (db?.isDBOpen()) return db;
  db = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
  await db.open();
  await db.execute(SCHEMA_SQL);
  return db;
}

// Calendar
export async function addCalendarEntryNative(entry: Omit<CalendarEntry, 'id' | 'created_at' | 'updated_at'>) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  await conn.run(`INSERT INTO calendar_entries (date, exercise_id, note) VALUES (?,?,?)`, [entry.date, entry.exerciseId, entry.note ?? null]);
}
export async function listCalendarEntriesNative(opts: { exerciseId?: number; from?: string; to?: string } = {}) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  let sql = `SELECT * FROM calendar_entries`;
  const params: any[] = [];
  const where: string[] = [];
  if (typeof opts.exerciseId === 'number') { where.push('exercise_id = ?'); params.push(opts.exerciseId); }
  if (opts.from && opts.to) { where.push('date BETWEEN ? AND ?'); params.push(opts.from, opts.to); }
  if (where.length) sql += ` WHERE ${where.join(' AND ')}`;
  sql += ` ORDER BY date DESC, id DESC`;
  const res = await conn.query(sql, params);
  return (res.values || []) as CalendarEntry[];
}

// Notes
export async function addNoteNative(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  await conn.run(`INSERT INTO notes (exercise_id, content) VALUES (?,?)`, [note.exerciseId, note.content]);
}
export async function listNotesNative(exerciseId: number) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  const res = await conn.query(`SELECT * FROM notes WHERE exercise_id = ? ORDER BY id DESC`, [exerciseId]);
  return (res.values || []) as Note[];
}
export async function deleteNoteNative(id: number) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  await conn.run(`DELETE FROM notes WHERE id = ?`, [id]);
}

// People
export async function addPersonNative(p: Omit<Person, 'id' | 'created_at' | 'updated_at'>) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  await conn.run(`INSERT INTO people (exercise_id, name, notes, forgiven) VALUES (?,?,?,?)`, [p.exerciseId, p.name, p.notes ?? null, p.forgiven ? 1 : 0]);
}
export async function listPeopleNative(exerciseId: number) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  const res = await conn.query(`SELECT * FROM people WHERE exercise_id = ? ORDER BY name ASC, id DESC`, [exerciseId]);
  const rows = (res.values || []) as (Person & { forgiven?: number })[];
  return rows.map(r => ({ ...r, forgiven: !!r.forgiven }));
}
export async function updatePersonForgivenessNative(id: number, forgiven: boolean) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  await conn.run(`UPDATE people SET forgiven = ? WHERE id = ?`, [forgiven ? 1 : 0, id]);
}
export async function deletePersonNative(id: number) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  await conn.run(`DELETE FROM people WHERE id = ?`, [id]);
}

// Export / Import
export async function exportJSONNative() {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  const [cal, notes, people] = await Promise.all([
    conn.query(`SELECT * FROM calendar_entries`),
    conn.query(`SELECT * FROM notes`),
    conn.query(`SELECT * FROM people`)
  ]);
  return JSON.stringify({
    calendar_entries: cal.values || [],
    notes: notes.values || [],
    people: people.values || []
  }, null, 2);
}
export async function backupToFileNative(jsonString: string) {
  const fileName = `soulhealing-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  await Filesystem.writeFile({ path: fileName, data: jsonString, directory: Directory.Documents, encoding: 'utf8' });
  await Share.share({ title: 'Backup SoulHealing', text: 'Exportación de datos', url: `documents://${fileName}`, dialogTitle: 'Compartir backup' });
  return fileName;
}
export async function importJSONNative(jsonString: string) {
  const conn = await initNativeDB();
  if (!conn) throw new Error('DB not initialized');
  const data = JSON.parse(jsonString);
  await conn.run('BEGIN');
  try {
    await conn.run('DELETE FROM calendar_entries');
    await conn.run('DELETE FROM notes');
    await conn.run('DELETE FROM people');
    for (const r of data.calendar_entries || []) {
      await conn.run(`INSERT INTO calendar_entries (id,date,exercise_id,note,created_at,updated_at) VALUES (?,?,?,?,?,?)`,
        [r.id, r.date, r.exercise_id, r.note ?? null, r.created_at ?? null, r.updated_at ?? null]);
    }
    for (const n of data.notes || []) {
      await conn.run(`INSERT INTO notes (id,exercise_id,content,created_at,updated_at) VALUES (?,?,?,?,?)`,
        [n.id, n.exercise_id, n.content, n.created_at ?? null, n.updated_at ?? null]);
    }
    for (const p of data.people || []) {
      await conn.run(`INSERT INTO people (id,exercise_id,name,notes,forgiven,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`,
        [p.id, p.exercise_id, p.name, p.notes ?? null, p.forgiven ? 1 : 0, p.created_at ?? null, p.updated_at ?? null]);
    }
    await conn.run('COMMIT');
  } catch (e) {
    await conn.run('ROLLBACK');
    throw e;
  }
}