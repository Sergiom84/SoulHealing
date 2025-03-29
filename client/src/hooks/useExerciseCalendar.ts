import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Modelo para el frontend (camelCase)
export type ExerciseRecord = {
  id?: number;
  userId: string;
  exerciseId: number;
  completedDate: string;
  createdAt?: string;
};

// Hook para obtener registros desde Supabase
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
      const { data, error } = await supabase
        .from('exercise_records')
        .select('*')
        .eq("user_id", userId)
        .order('completed_date', { ascending: false });

      if (error) throw error;

      // Mapear los datos snake_case → camelCase
      const formatted = (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        exerciseId: row.exercise_id,
        completedDate: row.completed_date,
        createdAt: row.created_at,
      }));

      setRecords(formatted);
    } catch (err: any) {
      console.error('Error fetching exercise records:', err);
      setError(err.message);
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
    const { data: existingRecords, error: fetchError } = await supabase
      .from('exercise_records')
      .select('*')
      .eq("user_id", userId)
      .eq('completed_date', completedDate);

    if (fetchError) throw fetchError;

    if (existingRecords && existingRecords.length > 0) {
      const { error } = await supabase
        .from('exercise_records')
        .update({ exercise_id: exerciseId })
        .eq('id', existingRecords[0].id);

      if (error) throw error;
      return existingRecords[0];
    }

    const newRecord = {
      user_id: userId,
      exercise_id: exerciseId,
      completed_date: completedDate,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('exercise_records')
      .insert([newRecord])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error('Error adding exercise record:', error);
    throw error;
  }
}

// Obtener el ejercicio para una fecha específica
export async function getExerciseForDate(userId: string, date: string) {
  try {
    const { data, error } = await supabase
      .from('exercise_records')
      .select('*')
      .eq("user_id", userId)
      .eq('completed_date', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) return null;

    // Mapear de snake_case a camelCase
    return {
      id: data.id,
      userId: data.user_id,
      exerciseId: data.exercise_id,
      completedDate: data.completed_date,
      createdAt: data.created_at,
    };
  } catch (error: any) {
    console.error('Error getting exercise for date:', error);
    throw error;
  }
}
