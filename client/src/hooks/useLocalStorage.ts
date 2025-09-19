import { useState, useCallback, useEffect } from 'react';

// Interfaces para nombres
export interface Name {
  id: number;
  name: string;
  exerciseId: number;
  forgiven: boolean;
  createdAt: string;
}

// Interfaces para notas
export interface Note {
  id: number;
  content: string;
  exerciseId: number;
  createdat: string;
  read: boolean;
}

const NAMES_STORAGE_KEY = 'soulhealing_names';
const NOTES_STORAGE_KEY = 'soulhealing_notes';

// Hook para nombres
export function useLocalNames(exerciseId: number) {
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar nombres del localStorage
  useEffect(() => {
    try {
      const savedNames = localStorage.getItem(NAMES_STORAGE_KEY);
      if (savedNames) {
        const allNames: Name[] = JSON.parse(savedNames);
        const exerciseNames = allNames.filter(name => name.exerciseId === exerciseId);
        setNames(exerciseNames);
      }
    } catch (error) {
      console.error('Error cargando nombres:', error);
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  // Guardar nombres en localStorage
  const saveNames = useCallback((newNames: Name[]) => {
    try {
      const savedNames = localStorage.getItem(NAMES_STORAGE_KEY);
      const allNames: Name[] = savedNames ? JSON.parse(savedNames) : [];
      
      // Filtrar nombres de otros ejercicios y agregar los nuevos
      const otherExerciseNames = allNames.filter(name => name.exerciseId !== exerciseId);
      const updatedAllNames = [...otherExerciseNames, ...newNames];
      
      localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(updatedAllNames));
      setNames(newNames);
    } catch (error) {
      console.error('Error guardando nombres:', error);
    }
  }, [exerciseId]);

  // Agregar nombre
  const addName = useCallback(async (name: string) => {
    const newName: Name = {
      id: Date.now(), // Usar timestamp como ID único
      name: name.trim(),
      exerciseId,
      forgiven: false,
      createdAt: new Date().toISOString(),
    };

    const updatedNames = [...names, newName];
    saveNames(updatedNames);
  }, [names, saveNames, exerciseId]);

  // Actualizar estado de perdón
  const updateNameForgiveness = useCallback(async (nameId: number, forgiven: boolean) => {
    const updatedNames = names.map(name =>
      name.id === nameId ? { ...name, forgiven } : name
    );
    saveNames(updatedNames);
  }, [names, saveNames]);

  // Eliminar nombre
  const deleteName = useCallback(async (nameId: number) => {
    const updatedNames = names.filter(name => name.id !== nameId);
    saveNames(updatedNames);
  }, [names, saveNames]);

  // Refetch (para compatibilidad con la interfaz existente)
  const refetch = useCallback(async () => {
    // En el almacenamiento local no necesitamos refetch, pero mantenemos para compatibilidad
    return Promise.resolve();
  }, []);

  return {
    names,
    loading,
    error: null,
    addName,
    updateNameForgiveness,
    deleteName,
    refetch
  };
}

// Hook para notas
export function useLocalNotes(exerciseId: number) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar notas del localStorage
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes) {
        const allNotes: Note[] = JSON.parse(savedNotes);
        const exerciseNotes = allNotes
          .filter(note => note.exerciseId === exerciseId)
          .map(note => ({
            ...note,
            read: note.read !== undefined ? note.read : false // Migración: agregar campo read si no existe
          }))
          .sort((a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime()); // Más recientes primero
        setNotes(exerciseNotes);
      }
    } catch (error) {
      console.error('Error cargando notas:', error);
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  // Guardar notas en localStorage
  const saveNotes = useCallback((newNotes: Note[]) => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
      
      // Filtrar notas de otros ejercicios y agregar las nuevas
      const otherExerciseNotes = allNotes.filter(note => note.exerciseId !== exerciseId);
      const updatedAllNotes = [...otherExerciseNotes, ...newNotes];
      
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedAllNotes));
      
      // Ordenar por fecha (más recientes primero) antes de actualizar el estado
      const sortedNotes = newNotes.sort((a, b) => 
        new Date(b.createdat).getTime() - new Date(a.createdat).getTime()
      );
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error guardando notas:', error);
    }
  }, [exerciseId]);

  // Agregar nota
  const addNote = useCallback(async (content: string) => {
    const newNote: Note = {
      id: Date.now(), // Usar timestamp como ID único
      content: content.trim(),
      exerciseId,
      createdat: new Date().toISOString(),
      read: false,
    };

    const updatedNotes = [newNote, ...notes]; // Agregar al principio
    saveNotes(updatedNotes);
  }, [notes, saveNotes, exerciseId]);

  // Actualizar estado de lectura
  const updateNoteRead = useCallback(async (noteId: number, read: boolean) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, read } : note
    );
    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  // Eliminar nota
  const deleteNote = useCallback(async (noteId: number) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  // Refetch (para compatibilidad con la interfaz existente)
  const refetch = useCallback(async () => {
    // En el almacenamiento local no necesitamos refetch, pero mantenemos para compatibilidad
    return Promise.resolve();
  }, []);

  return {
    notes,
    loading,
    error: null,
    addNote,
    updateNoteRead,
    deleteNote,
    refetch
  };
}

// Funciones helper para compatibilidad con la API existente
export const addName = async (name: string, exerciseId: number, userId?: string) => {
  // Esta función se mantendrá por compatibilidad pero no se usa directamente
  // El hook useLocalNames maneja esto internamente
  return Promise.resolve();
};

export const updateNameForgiveness = async (nameId: number, forgiven: boolean) => {
  // Esta función se mantendrá por compatibilidad pero no se usa directamente
  // El hook useLocalNames maneja esto internamente
  return Promise.resolve();
};

export const addNote = async (content: string, exerciseId: number, userId?: string) => {
  // Esta función se mantendrá por compatibilidad pero no se usa directamente
  // El hook useLocalNotes maneja esto internamente
  return Promise.resolve();
};