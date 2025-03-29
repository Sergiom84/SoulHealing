import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Tipo para el perfil de usuario
export type UserProfile = {
  id?: string;
  user_id: string;
  display_name: string;
  created_at?: string;
  updated_at?: string;
};

// Hook para obtener el perfil del usuario
export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}

// Función para crear o actualizar el perfil del usuario
export async function upsertUserProfile(displayName: string) {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      throw sessionError || new Error("No hay sesión activa");
    }
    const userId = sessionData.session.user.id;

    const profile = {
      user_id: userId,
      display_name: displayName,
      updated_at: new Date().toISOString()
    };

    // Verificar si ya existe un perfil
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      // Actualizar perfil existente
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Crear nuevo perfil con created_at
      const newProfile = {
        ...profile,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Función para obtener un saludo según la hora del día
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Buenos días';
  } else if (hour >= 12 && hour < 20) {
    return 'Buenas tardes';
  } else {
    return 'Buenas noches';
  }
}
