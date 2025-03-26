import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eflsmqrxpoupmyhbdoev.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHNtcXJ4cG91cG15aGJkb2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDA5NTAsImV4cCI6MjA1ODQxNjk1MH0.yV4wLNB6odsCzqVqI9ND3n8oPy5kQqL_01pjNir5sr4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
