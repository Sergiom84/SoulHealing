import { useState, useEffect } from 'react';
import { listCalendarEntries, addCalendarEntry } from '@/lib/db';

// Modelo para el frontend (camelCase)
export type ExerciseRecord = {
  id?: number;
  userId: string;
  exerciseId: number;
  completedDate: string;
  createdAt?: string;
};

// Hook para obtener registros desde local storage
export function useExerciseRecords(userId?: string) {
  const [records, setRecords] = useState<ExerciseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    if (!userId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await listCalendarEntries();
      
      // Mapear datos locales a formato esperado
      const formatted = (data || []).map((row) => ({
        id: row.id,
        userId: 'local-user',
        exerciseId: row.exerciseId,
        completedDate: row.date,
        createdAt: row.created_at,
      }));

      setRecords(formatted);
    } catch (err: any) {
      console.error('Error fetching exercise records:', err);
      setError(err.message || 'Error local');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [userId]);

  return { records, loading, error, refetch: fetchRecords };
}

// Función para insertar o actualizar un registro
export async function addExerciseRecord(
  userId: string,
  exerciseId: number,
  completedDate: string
) {
  try {
    // Verificar si ya existe un registro para esta fecha
    const existing = await listCalendarEntries({ from: completedDate, to: completedDate });
    
    if (existing && existing.length > 0) {
      // En una implementación más completa, podrías actualizar el registro existente
      // Por ahora, simplemente devolvemos el existente
      return existing[0];
    }

    await addCalendarEntry({
      date: completedDate,
      exerciseId: exerciseId,
      note: `Ejercicio ${exerciseId} completado`
    });

    return {
      userId: 'local-user',
      exerciseId,
      completedDate,
      createdAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Error adding exercise record:', error);
    throw error;
  }
}

// Obtener el ejercicio para una fecha específica
export async function getExerciseForDate(userId: string, date: string) {
  try {
    const data = await listCalendarEntries({ from: date, to: date });
    
    if (!data || data.length === 0) return null;
    
    const record = data[0];
    return {
      id: record.id,
      userId: 'local-user',
      exerciseId: record.exerciseId,
      completedDate: record.date,
      createdAt: record.created_at,
    };
  } catch (error: any) {
    console.error('Error getting exercise for date:', error);
    throw error;
  }
}
