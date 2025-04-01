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
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Obtener el usuario autenticado
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const user = userData?.user;
        if (!user) throw new Error("Usuario no autenticado");

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        setProfile(data);
      } catch (err: any) {
        console.error('Error al obtener el perfil del usuario:', err);
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
    // Obtener el usuario autenticado directamente
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const user = userData?.user;
    if (!user) throw new Error("Usuario no autenticado");

    const userId = user.id;

    const profile = {
      user_id: userId,
      display_name: displayName,
      updated_at: new Date().toISOString()
    };

    // Primero verificar si ya existe un perfil para este usuario
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    let result;
    
    if (existingProfile) {
      // Si existe, actualizar usando el ID existente
      console.log('Actualizando perfil existente con ID:', existingProfile.id);
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          display_name: displayName,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Si no existe, insertar nuevo
      console.log('Creando nuevo perfil para usuario:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }

    return result;
  } catch (error: any) {
    console.error('Error al actualizar el perfil del usuario:', error);
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
