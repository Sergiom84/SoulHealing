// Implementación local que mantiene la API del hook original para no romper la UI.
import { useEffect, useState, useCallback } from 'react';
import { addPerson, listPeople, updatePersonForgiveness, deletePerson as dbDeletePerson, addNote as dbAddNote, listNotes, deleteNote as dbDeleteNote } from '@/lib/db';

export type Name = {
  id: number;
  name: string;
  forgiven: boolean;
  userid: string;
  exerciseid: number;
  createdat: string;
};

export type Note = {
  id: number;
  exerciseid: number;
  content: string;
  userid?: string;
  createdat: string;
};

// Hook para obtener nombres (personas) por ejercicio (userId se ignora en modo local)
export function useNames(exerciseId: number, _userId?: string) {
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNames = useCallback(async () => {
    try {
      setLoading(true);
      const people = await listPeople(exerciseId);
      const mapped: Name[] = (people || []).map(p => ({
        id: p.id!,
        name: p.name,
        forgiven: !!p.forgiven,
        userid: 'local-user',
        exerciseid: p.exerciseId,
        createdat: p.created_at || new Date().toISOString(),
      }));
      setNames(mapped);
    } catch (e: any) {
      setError(e?.message || 'Error local');
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => { fetchNames(); }, [fetchNames]);

  return { names, loading, error, refetch: fetchNames };
}

export async function addName(name: string, exerciseId: number, _userId: string) {
  await addPerson({ name, exerciseId, notes: null, forgiven: false });
}

export async function updateNameForgiveness(id: number, forgiven: boolean) {
  await updatePersonForgiveness(id, forgiven);
  return true;
}

export async function deleteName(id: number) {
  await dbDeletePerson(id);
  return true;
}

// Hook para obtener notas por ejercicio (userId se ignora)
export function useNotes(exerciseId: number, _userId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listNotes(exerciseId);
      const mapped: Note[] = (data || []).map(n => ({
        id: n.id!,
        exerciseid: n.exerciseId,
        content: n.content,
        userid: 'local-user',
        createdat: n.created_at || new Date().toISOString(),
      }));
      setNotes(mapped);
    } catch (e: any) {
      setError(e?.message || 'Error local');
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  return { notes, loading, error, refetch: fetchNotes };
}

// Mantener nombres de funciones usadas por la UI original
export async function addNote(content: string, exerciseId: number, _userId: string) {
  await dbAddNote({ content, exerciseId });
  return true;
}

export async function deleteNote(id: number) {
  await dbDeleteNote(id);
  return true;
}