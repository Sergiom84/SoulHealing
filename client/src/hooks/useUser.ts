import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user ?? null);
        setLoading(false);
      };
  
      getUser();
  
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
  
      return () => {
        listener.subscription.unsubscribe();
      };
    }, []);
  
    return { user, loading };
  }