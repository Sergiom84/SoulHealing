import { useEffect, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';   // iconos outline
import { supabase } from '@/lib/supabaseClient'; // Ruta a tu cliente centralizado

export default function AuthIndicator() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // 1ª comprobación al montar
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });

    // Suscripción a cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => setLoggedIn(!!session?.user)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loggedIn === null) return null;

  return (
    <button
      className="relative flex items-center justify-center rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
      title={loggedIn ? 'Cerrar sesión' : 'Iniciar sesión'}
      onClick={() =>
        loggedIn
          ? supabase.auth.signOut()
          : supabase.auth.signInWithOAuth({ provider: 'google' })
      }
    >
      {loggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
      <span
        className={`absolute -right-1 -top-1 h-2 w-2 rounded-full ${
          loggedIn ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
    </button>
  );
}
