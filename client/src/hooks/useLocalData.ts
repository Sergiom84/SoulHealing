import { useEffect, useState, useCallback } from 'react';
import { initDB, addCalendarEntry, listCalendarEntries, addNote, listNotes, deleteNote as dbDeleteNote, addPerson, listPeople, updatePersonForgiveness, deletePerson as dbDeletePerson, exportJSON, backupJSON, importJSON } from '@/lib/db';
import type { CalendarEntry, Note, Person } from '@/lib/db/schema';

export function useCalendar(exerciseId?: number, range?: { from: string; to: string }) {
  const [items, setItems] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const data = await listCalendarEntries({ exerciseId, from: range?.from, to: range?.to });
    setItems(data);
    setLoading(false);
  }, [exerciseId, range?.from, range?.to]);

  useEffect(() => { initDB().then(refetch); }, [refetch]);

  return { items, loading, add: addCalendarEntry, refetch };
}

export function useNotesLocal(exerciseId: number) {
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const data = await listNotes(exerciseId);
    setItems(data);
    setLoading(false);
  }, [exerciseId]);

  useEffect(() => { initDB().then(refetch); }, [refetch]);

  return { items, loading, add: addNote, remove: dbDeleteNote, refetch };
}

export function usePeopleLocal(exerciseId: number) {
  const [items, setItems] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const data = await listPeople(exerciseId);
    setItems(data);
    setLoading(false);
  }, [exerciseId]);

  useEffect(() => { initDB().then(refetch); }, [refetch]);

  return { items, loading, add: addPerson, remove: dbDeletePerson, setForgiven: updatePersonForgiveness, refetch };
}

export function useBackup() {
  const [busy, setBusy] = useState(false);

  const doExport = useCallback(async () => {
    setBusy(true);
    const json = await exportJSON();
    await backupJSON(json);
    setBusy(false);
  }, []);

  const doImport = useCallback(async (jsonString: string) => {
    setBusy(true);
    await importJSON(jsonString);
    setBusy(false);
  }, []);

  return { busy, doExport, doImport };
}