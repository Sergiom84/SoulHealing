import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Name, Note } from '@/types';

// Hook para obtener nombres por ejercicio y usuario con función refetch
export function useNames(exerciseId: number, userId?: string) {
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNames = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('names')
        .select('*')
        .eq("userid", userId)
        .eq('exerciseid', exerciseId)
        .order('createdat', { ascending: false });

      if (error) throw error;

      setNames(data || []);
    } catch (err: any) {
      console.error('Error fetching names:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNames();
  }, [exerciseId, userId]);

  return { names, loading, error, refetch: fetchNames };
}

// Hook para obtener notas por ejercicio y usuario
export function useNotes(exerciseId: number, userId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq("userid", userId)
        .eq('exerciseid', exerciseId)
        .order('createdat', { ascending: false });

      if (error) throw error;

      setNotes(data || []);
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [exerciseId, userId]);

  return { notes, loading, error, refetch: fetchNotes };
}

// Función para agregar un nombre
export async function addName(name: string, exerciseId: number, userId: string) {
  try {
    const newName = {
      name,
      forgiven: false,
      userid: userId,
      exerciseid: exerciseId,
      createdat: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('names')
      .insert([newName])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error('Error adding name:', error);
    throw error;
  }
}

// Función para actualizar el estado de perdón de un nombre
export async function updateNameForgiveness(id: number, forgiven: boolean) {
  try {
    const { error } = await supabase
      .from('names')
      .update({ forgiven })
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error: any) {
    console.error('Error updating name forgiveness:', error);
    throw error;
  }
}

// Función para agregar una nota
export async function addNote(content: string, exerciseId: number, userId: string) {
  try {
    const newNote = {
      content,
      userid: userId,
      exerciseid: exerciseId,
      createdat: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error('Error adding note:', error);
    throw error;
  }
}
