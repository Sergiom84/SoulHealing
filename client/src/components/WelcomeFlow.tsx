import { useEffect, useState, ReactNode } from 'react';
import { supabase, checkAuthStatus } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { upsertUserProfile } from '@/hooks/useUserProfile';
import { useLocation } from 'wouter';

// Modificado para aceptar children como prop
export default function WelcomeFlow({ children }: { children?: ReactNode }) {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showNameForm, setShowNameForm] = useState(false);
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

        // Verificar si el perfil ya existe
        const { data: existingProfile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error al verificar el perfil existente:', error);
          throw error;
        }

        if (existingProfile) {
          console.log('Perfil ya existe:', existingProfile);
          setUserId(user.id);
          setShowNameForm(false); // No mostrar el formulario si ya existe el perfil
        } else {
          console.log('Usuario autenticado pero sin perfil:', user);
          setUserId(user.id);
          setShowNameForm(true); // Mostrar el formulario si no existe el perfil
        }
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

      // Usar la función upsertUserProfile
      try {
        const data = await upsertUserProfile(displayName.trim());
        console.log('Nombre guardado exitosamente:', data);
        
        // Mostrar mensaje y ocultar el formulario
        alert('Nombre guardado exitosamente');
        setShowNameForm(false);
        
      } catch (error: any) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error al guardar el nombre:', err);
      setError(err.message || 'Error al guardar el nombre');
    } finally {
      setLoading(false);
    }
  };

  // Si está cargando, mostrar indicador de carga
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  // Si hay error de autenticación, mostrar mensaje
  if (error && !showNameForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate('/auth')}
            >
              Volver al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si necesita ingresar su nombre, mostrar el formulario
  if (showNameForm) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
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
      </div>
    );
  }

  // Si ya tiene perfil, mostrar los componentes hijos (rutas protegidas)
  return <>{children}</>;
}
