import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Auth({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setError(null);
    const fn = isLogin ? supabase.auth.signInWithPassword : supabase.auth.signUp;

    const { data, error } = await fn({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      onAuthSuccess?.();
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-2xl text-center">
        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>

      <Input
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button className="w-full" onClick={handleAuth}>
        {isLogin ? 'Entrar' : 'Registrarse'}
      </Button>

      <p
        className="text-sm text-center text-blue-600 cursor-pointer hover:underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? '¿No tienes cuenta? Regístrate aquí'
          : '¿Ya tienes cuenta? Inicia sesión'}
      </p>
    </div>
  );
}
