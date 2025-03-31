import { createClient } from '@supabase/supabase-js';

// Usar variables de entorno de Vite para el cliente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eflsmqrxpoupmyhbdoev.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHNtcXJ4cG91cG15aGJkb2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA5NTAsImV4cCI6MjA1ODQxNjk1MH0.yV4wLNB6odsCzqVqI9ND3n8oPy5kQqL_01pjNir5sr4';

// Añadir logging para depuración
console.log('Inicializando Supabase con:', { 
  url: supabaseUrl,
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
