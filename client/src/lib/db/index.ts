import { Capacitor } from '@capacitor/core';
import type { CalendarEntry, Note, Person } from './schema';
import {
  initNativeDB,
  addCalendarEntryNative, listCalendarEntriesNative,
  addNoteNative, listNotesNative, deleteNoteNative,
  addPersonNative, listPeopleNative, updatePersonForgivenessNative, deletePersonNative,
  exportJSONNative, backupToFileNative, importJSONNative
} from './native';
import {
  initWebDB,
  addCalendarEntryWeb, listCalendarEntriesWeb,
  addNoteWeb, listNotesWeb, deleteNoteWeb,
  addPersonWeb, listPeopleWeb, updatePersonForgivenessWeb, deletePersonWeb,
  exportJSONWeb, downloadBackup, importJSONWeb
} from './web';

export async function initDB() {
  if (Capacitor.isNativePlatform()) return initNativeDB();
  return initWebDB();
}

// Calendar
export async function addCalendarEntry(entry: Omit<CalendarEntry, 'id' | 'created_at' | 'updated_at'>) {
  return Capacitor.isNativePlatform() ? addCalendarEntryNative(entry) : addCalendarEntryWeb(entry);
}
export async function listCalendarEntries(opts: { exerciseId?: number; from?: string; to?: string } = {}) {
  return Capacitor.isNativePlatform() ? listCalendarEntriesNative(opts) : listCalendarEntriesWeb(opts);
}

// Notes
export async function addNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
  return Capacitor.isNativePlatform() ? addNoteNative(note) : addNoteWeb(note);
}
export async function listNotes(exerciseId: number) {
  return Capacitor.isNativePlatform() ? listNotesNative(exerciseId) : listNotesWeb(exerciseId);
}
export async function deleteNote(id: number) {
  return Capacitor.isNativePlatform() ? deleteNoteNative(id) : deleteNoteWeb(id);
}

// People
export async function addPerson(p: Omit<Person, 'id' | 'created_at' | 'updated_at'>) {
  return Capacitor.isNativePlatform() ? addPersonNative(p) : addPersonWeb(p);
}
export async function listPeople(exerciseId: number) {
  return Capacitor.isNativePlatform() ? listPeopleNative(exerciseId) : listPeopleWeb(exerciseId);
}
export async function updatePersonForgiveness(id: number, forgiven: boolean) {
  return Capacitor.isNativePlatform() ? updatePersonForgivenessNative(id, forgiven) : updatePersonForgivenessWeb(id, forgiven);
}
export async function deletePerson(id: number) {
  return Capacitor.isNativePlatform() ? deletePersonNative(id) : deletePersonWeb(id);
}

// Backup
export async function exportJSON() {
  return Capacitor.isNativePlatform() ? exportJSONNative() : exportJSONWeb();
}
export async function backupJSON(jsonString: string) {
  return Capacitor.isNativePlatform() ? backupToFileNative(jsonString) : downloadBackup(jsonString);
}
export async function importJSON(jsonString: string) {
  return Capacitor.isNativePlatform() ? importJSONNative(jsonString) : importJSONWeb(jsonString);
}