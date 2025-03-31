import { useEffect, useState } from 'react';
import { useLocation } from "wouter";
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { upsertUserProfile, UserProfile } from '@/hooks/useUserProfile';

export default function WelcomeFlow({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // Contador de reintentos
  const [, navigate] = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        console.log('Intentando obtener sesión...', { intento: retryCount + 1 });
        
        // Verificar si hay una sesión activa
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Resultado de getSession:', { 
          tieneSession: !!sessionData?.session,
          error: sessionError ? sessionError.message : null
        });
        
        if (sessionError) throw sessionError;
        
        if (!sessionData?.session?.user) {
          // Si no hay sesión, intentar iniciar sesión anónima
          if (retryCount < 3) {
            console.log('No hay sesión activa, intentando iniciar sesión anónima...');
            const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
            
            if (signInError) {
              console.error('Error al iniciar sesión anónima:', signInError);
              setError("No hay sesión activa");
              setLoading(false);
              return;
            }
            
            if (signInData.session) {
              console.log('Sesión anónima creada exitosamente');
              setUserId(signInData.session.user.id);
              setRetryCount(retryCount + 1);
              setLoading(false);
              return; // Salir y dejar que el efecto se ejecute nuevamente
            }
          } else {
            setError("No hay sesión activa");
            setLoading(false);
            return;
          }
        }
        
        // Asegurarse de que sessionData.session no sea null antes de acceder a user
        if (sessionData.session) {
          const user = sessionData.session.user;
          setUserId(user.id);
          
          console.log('Usuario autenticado:', { id: user.id });
          
          // Obtener perfil del usuario
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          console.log('Resultado de consulta de perfil:', { 
            tieneData: !!data,
            error: error ? error.message : null
          });
          
          if (error && error.code !== 'PGRST116') throw error;
          
          setProfile(data || null);
          setDisplayName(data?.display_name || '');
        }
      } catch (err: any) {
        console.error("Error cargando perfil:", err);
        setError("Error al cargar tu perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [retryCount]);

  const handleSaveName = async () => {
    setError(null);
    setLoading(true);

    if (!displayName.trim()) {
      setError('Por favor, introduce tu nombre');
      setLoading(false);
      return;
    }

    try {
      console.log('Intentando guardar nombre:', { 
        displayName: displayName.trim(),
        userId
      });
      
      if (!userId) {
        throw new Error('No hay ID de usuario disponible');
      }
      
      // Guardar directamente sin usar la función upsertUserProfile
      const profile = {
        user_id: userId,
        display_name: displayName.trim(),
        updated_at: new Date().toISOString()
      };
      
      // Verificar si ya existe un perfil
      const { data: existingProfile, error: queryError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (queryError && queryError.code !== 'PGRST116') {
        console.error('Error al verificar perfil existente:', queryError);
        throw queryError;
      }
      
      let result;
      
      if (existingProfile) {
        console.log('Actualizando perfil existente');
        // Actualizar perfil existente
        const { data, error } = await supabase
          .from('user_profiles')
          .update(profile)
          .eq('user_id', userId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        console.log('Creando nuevo perfil');
        // Crear nuevo perfil con created_at
        const newProfile = {
          ...profile,
          created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('user_profiles')
          .insert([newProfile])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      console.log('Perfil guardado exitosamente:', result);
      
      setProfile(result);
    } catch (err: any) {
      console.error('Error al guardar nombre:', err);
      setError('No se pudo guardar tu nombre');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  if (!profile || !profile.display_name) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center">¡Bienvenido!</CardTitle>
          <CardDescription className="text-center">
            Antes de empezar, por favor dinos tu nombre
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="displayName">Tu nombre</Label>
          <Input
            id="displayName"
            placeholder="Escribe tu nombre"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            className="w-full" 
            onClick={handleSaveName}
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

  // Ya tiene nombre → mostramos el contenido de la app
  return <>{children}</>;
}
