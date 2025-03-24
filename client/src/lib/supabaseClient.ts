import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eflsmqrxpoupmyhbdoev.supabase.co';
const supabaseAnonKey = 'TU_ANON_KEYeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHNtcXJ4cG91cG15aGJkb2V2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjg0MDk1MCwiZXhwIjoyMDU4NDE2OTUwfQ.dPvccjQyEeqgs72KxfreFr8L90-Ba7R0mC1i8-VNHes';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
