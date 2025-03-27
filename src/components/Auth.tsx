import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { upsertUserProfile } from '@/hooks/useUserProfile';

export default function Auth({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false); // 🆕 Estado

  const handleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Iniciar sesión
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onAuthSuccess?.();
      } else {
        // Registrarse
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setConfirmationSent(true); 
// No mostramos la pantalla de nombre todavía

      }
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async () => {
    setError(null);
    setLoading(true);

    if (!userId || !displayName.trim()) {
      setError('Por favor, introduce tu nombre');
      setLoading(false);
      return;
    }

    try {
      await upsertUserProfile(displayName.trim());
      onAuthSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Error al guardar tu nombre');
    } finally {
      setLoading(false);
    }
  };

  if (showNameInput) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">¡Bienvenido!</CardTitle>
          <CardDescription className="text-center">
            Para personalizar tu experiencia, por favor dinos tu nombre
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Tu nombre</Label>
            <Input
              id="displayName"
              placeholder="Escribe tu nombre"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button 
            className="w-full" 
            onClick={handleNameSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Continuar'}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            "El perdón es la llave de la felicidad"
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <Input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {confirmationSent && (
          <p className="text-sm text-yellow-500 text-center">
            ✉️ Te hemos enviado un correo de verificación. Por favor, confírmalo antes de iniciar sesión.
          </p>
        )}

        <Button 
          className="w-full" 
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
        </Button>

        <p
          className="text-sm text-center text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? '¿No tienes cuenta? Regístrate aquí'
            : '¿Ya tienes cuenta? Inicia sesión'}
        </p>
      </CardContent>
    </Card>
  );
}
