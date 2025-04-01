// src/components/Auth.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Por favor, completa todos los campos');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUserId(data.user.id);
        setShowNameInput(true);
        setConfirmationSent(true);
      }
    } catch (err: any) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Por favor, completa todos los campos');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (!profileData) {
          setUserId(data.user.id);
          setShowNameInput(true);
          return;
        }
      }

      onAuthSuccess();
    } catch (err: any) {
      console.error('Error en inicio de sesión:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      {confirmationSent && (
        <p className="text-sm text-yellow-500 text-center">
          ✉️ Te hemos enviado un correo de verificación. Por favor, confírmalo antes de iniciar sesión.
        </p>
      )}
    </Card>
  );
}
