// Implementación local simplificada para mantener compatibilidad
import { useState, useEffect } from 'react';

// Tipo para el perfil de usuario
export type UserProfile = {
  id?: string;
  user_id: string;
  display_name: string;
  created_at?: string;
  updated_at?: string;
};

// Hook para obtener el perfil del usuario (local)
export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // En modo local, obtenemos el perfil del localStorage
        const savedProfile = localStorage.getItem('user-profile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);
        } else {
          // Perfil por defecto
          const defaultProfile = {
            id: 'local-user',
            user_id: 'local-user',
            display_name: 'Usuario Local',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(defaultProfile);
          localStorage.setItem('user-profile', JSON.stringify(defaultProfile));
        }
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

// Función para crear o actualizar el perfil del usuario (local)
export async function upsertUserProfile(displayName: string) {
  try {
    const profile = {
      id: 'local-user',
      user_id: 'local-user',
      display_name: displayName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    localStorage.setItem('user-profile', JSON.stringify(profile));
    return profile;
  } catch (error: any) {
    console.error('Error al actualizar el perfil del usuario:', error);
    throw error;
  }
}

// Función para obtener un saludo según la hora del día
export function getTimeBasedGreeting(): string {
  const hora = new Date().getHours();
  
  if (hora >= 6 && hora < 12) {
    return "¡Buenos días!";
  } else if (hora >= 12 && hora < 18) {
    return "¡Buenas tardes!";
  } else {
    return "¡Buenas noches!";
  }
}