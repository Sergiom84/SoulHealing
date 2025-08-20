export type CalendarEntry = {
  id?: number;
  date: string; // ISO yyyy-mm-dd
  exerciseId: number;
  note?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Note = {
  id?: number;
  exerciseId: number;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export type Person = {
  id?: number;
  exerciseId: number;
  name: string;
  notes?: string | null;
  forgiven?: boolean;
  created_at?: string;
  updated_at?: string;
};

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS calendar_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  exercise_id INTEGER NOT NULL,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  notes TEXT,
  forgiven INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
`.trim();