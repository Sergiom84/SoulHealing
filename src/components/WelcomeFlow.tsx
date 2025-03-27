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

  const [, navigate] = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session?.user) {
          setError("No hay sesión activa");
          setLoading(false);
          return;
        }

        const user = sessionData.session.user;
        setUserId(user.id);

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        setProfile(data || null);
        setDisplayName(data?.display_name || '');
      } catch (err: any) {
        console.error("Error cargando perfil:", err);
        setError("Error al cargar tu perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveName = async () => {
    setError(null);
    setLoading(true);

    if (!displayName.trim()) {
      setError('Por favor, introduce tu nombre');
      setLoading(false);
      return;
    }

    try {
      await upsertUserProfile(displayName.trim());
      setProfile((prev) => ({
        ...(prev || { user_id: userId!, display_name: '' }),
        display_name: displayName.trim(),
      }));
    } catch (err: any) {
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
