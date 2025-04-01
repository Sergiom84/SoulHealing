import { useEffect, useState } from 'react';
import { supabase, checkAuthStatus } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { upsertUserProfile } from '@/hooks/useUserProfile';
import { useLocation } from 'wouter';

export default function WelcomeFlow() {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await checkAuthStatus();

        if (!user) {
          console.log('Redirigiendo al login, usuario no autenticado.');
          navigate('/auth');
          return;
        }

        if (!user.email_confirmed_at) {
          setError('Por favor, confirma tu correo electrónico antes de continuar.');
          setLoading(false);
          return;
        }

        setUserId(user.id);
      } catch (err: any) {
        console.error('Error al obtener el usuario:', err);
        setError('Error al verificar la sesión');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSaveName = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!displayName.trim()) {
        setError('Por favor, introduce tu nombre');
        setLoading(false);
        return;
      }

      if (!userId) {
        setError('Usuario no autenticado. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({ user_id: userId, display_name: displayName.trim() });

      if (error) throw error;

      alert('Nombre guardado exitosamente');
    } catch (err: any) {
      console.error('Error al guardar el nombre:', err);
      setError(err.message || 'Error al guardar el nombre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">¡Bienvenido!</CardTitle>
        <CardDescription className="text-center">
          Antes de empezar, dinos tu nombre
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor="displayName">Tu nombre</Label>
        <Input
          id="displayName"
          placeholder="Escribe tu nombre"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button 
          className="w-full" 
          onClick={handleSaveName} 
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar nombre'}
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
