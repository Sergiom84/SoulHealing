import { createClient } from '@supabase/supabase-js';

// Usar variables de entorno de Vite para el cliente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eflsmqrxpoupmyhbdoev.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHNtcXJ4cG91cG15aGJkb2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA5NTAsImV4cCI6MjA1ODQxNjk1MH0.yV4wLNB6odsCzqVqI9ND3n8oPy5kQqL_01pjNir5sr4';

// Añadir logging para depuración
console.log('Inicializando Supabase con:', {
  urlLoaded: !!supabaseUrl,
  anonKeyLoaded: !!supabaseAnonKey
});

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
      console.log('Sesión activa encontrada');
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
      tieneError: !!error
    });
  } catch (err) {
    console.error('Error al verificar sesión inicial:', err);
  }
})();
