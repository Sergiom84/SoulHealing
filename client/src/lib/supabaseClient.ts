import { createClient } from '@supabase/supabase-js';

// Usar variables de entorno de Vite para el cliente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eflsmqrxpoupmyhbdoev.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHNtcXJ4cG91cG15aGJkb2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA5NTAsImV4cCI6MjA1ODQxNjk1MH0.yV4wLNB6odsCzqVqI9ND3n8oPy5kQqL_01pjNir5sr4';

// Añadir logging para depuración
console.log('Inicializando Supabase con:', { 
  url: supabaseUrl,
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
});

// Configuración mejorada para entorno de producción
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          const itemStr = localStorage.getItem(key);
          if (!itemStr) return null;
          console.log(`Recuperando sesión con clave: ${key}`);
          return itemStr;
        } catch (error) {
          console.error('Error al recuperar sesión:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          console.log(`Guardando sesión con clave: ${key}`);
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error al guardar sesión:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error al eliminar sesión:', error);
        }
      }
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'soulhealing-client'
    }
  }
});

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
