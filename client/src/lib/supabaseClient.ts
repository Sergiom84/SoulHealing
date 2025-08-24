import { createClient } from '@supabase/supabase-js';

// Usar variables de entorno de Vite para el cliente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials: please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

// Añadir logging para depuración
// console.log('Inicializando Supabase con:', {
//   url: supabaseUrl,
//   keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
// });

// Configuración mejorada para entorno de producción
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
  global: {
    headers: {
      'X-Client-Info': 'soulhealing-client'
    }
  }
});

// Función para verificar si hay una sesión activa al cargar la aplicación
export async function checkAuthStatus() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data?.session) {
      console.log('Sesión activa encontrada:', data.session.user);
      return data.session.user;
    } else {
      console.log('No hay sesión activa');
      return null;
    }
  } catch (err) {
    console.error('Error al verificar el estado de autenticación:', err);
    return null;
  }
}

// Verificar estado de autenticación al cargar
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('Estado inicial de sesión:', {
      tieneSession: !!data.session,
      error: error ? error.message : null
    });
  } catch (err) {
    console.error('Error al verificar sesión inicial:', err);
  }
})();
