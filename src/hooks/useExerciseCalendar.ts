import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type ExerciseRecord = {
  id?: number;
  userId: string;
  exerciseId: number;
  completedDate: string;
  createdAt?: string;
};

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
        .order('completedDate', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
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

  return { records, loading, error, refetch: fetchRecords }; // 👈 Añadido
}

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
      .eq('completedDate', completedDate);

    if (fetchError) throw fetchError;

    if (existingRecords && existingRecords.length > 0) {
      const { error } = await supabase
        .from('exercise_records')
        .update({ exerciseId })
        .eq('id', existingRecords[0].id);

      if (error) throw error;
      return existingRecords[0];
    }

    const newRecord = {
      userId,
      exerciseId,
      completedDate,
      createdAt: new Date().toISOString(),
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

export async function getExerciseForDate(
  userId: string,
  date: string
) {
  try {
    const { data, error } = await supabase
      .from('exercise_records')
      .select('*')
      .eq("user_id", userId)
      .eq('completedDate', date)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error: any) {
    console.error('Error getting exercise for date:', error);
    throw error;
  }
}
