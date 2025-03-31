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
        console.log('Obteniendo perfil para usuario:', userId);

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        console.log('Resultado de consulta de perfil:', { 
          tieneData: !!data,
          error: error ? error.message : null
        });

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
    console.log('Intentando actualizar perfil con nombre:', displayName);
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Resultado de getSession en upsertUserProfile:', { 
      tieneSession: !!sessionData?.session,
      error: sessionError ? sessionError.message : null
    });
    
    if (sessionError) throw sessionError;
    
    if (!sessionData?.session?.user) {
      throw new Error("No hay sesión activa");
    }
    
    const userId = sessionData.session.user.id;
    
    const profile = {
      user_id: userId,
      display_name: displayName,
      updated_at: new Date().toISOString()
    };

    // Verificar si ya existe un perfil
    const { data: existingProfile, error: queryError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') {
      console.error('Error al verificar perfil existente:', queryError);
      throw queryError;
    }

    let result;
    
    if (existingProfile) {
      console.log('Actualizando perfil existente');
      // Actualizar perfil existente
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
      }
      
      result = data;
    } else {
      console.log('Creando nuevo perfil');
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

      if (error) {
        console.error('Error al insertar perfil:', error);
        throw error;
      }
      
      result = data;
    }
    
    console.log('Perfil guardado exitosamente:', result);
    return result;
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
