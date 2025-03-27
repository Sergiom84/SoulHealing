import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/hooks/useUser';

// Frases para cada ejercicio
const EXERCISE_PHRASES = {
  1: "Dios es el Amor en el que perdono.",
  2: "El Amor no abriga resentimientos.",
  3: "Que los milagros reemplacen todos mis resentimientos.",
  4: "El perdón es la llave de la felicidad.",
  5: "Quiero percibir el perdón tal como es."
};

export default function NotificationSettings() {
  const { user } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [frequency, setFrequency] = useState(4); // Horas por defecto
  const [loading, setLoading] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');

  // Cargar configuración de notificaciones al iniciar
  useState(() => {
    if (user?.id) {
      loadNotificationSettings();
    }
  }, [user?.id]);

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setNotificationsEnabled(data.enabled);
        setFrequency(data.frequency_hours);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      const settings = {
        user_id: user.id,
        enabled: notificationsEnabled,
        frequency_hours: frequency,
        updated_at: new Date().toISOString()
      };
      
      // Verificar si ya existe una configuración
      const { data: existingSettings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      let result;
      
      if (existingSettings) {
        // Actualizar configuración existente
        result = await supabase
          .from('notification_settings')
          .update(settings)
          .eq('user_id', user.id);
      } else {
        // Crear nueva configuración
        settings.created_at = new Date().toISOString();
        result = await supabase
          .from('notification_settings')
          .insert([settings]);
      }
      
      if (result.error) throw result.error;
      
      setSavedStatus('Configuración guardada correctamente');
      setTimeout(() => setSavedStatus(''), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setSavedStatus('Error al guardar la configuración');
      setTimeout(() => setSavedStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="settings" className="w-full">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="settings">Configuración</TabsTrigger>
        <TabsTrigger value="preview">Vista previa</TabsTrigger>
      </TabsList>
      
      <TabsContent value="settings" className="space-y-4 mt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Activar notificaciones</Label>
              <p className="text-sm text-muted-foreground">
                Recibe recordatorios para tus ejercicios
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Frecuencia de notificaciones</Label>
            <div className="flex flex-col space-y-2">
              <Slider
                disabled={!notificationsEnabled || loading}
                min={1}
                max={24}
                step={1}
                value={[frequency]}
                onValueChange={(value) => setFrequency(value[0])}
              />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">1 hora</span>
                <span className="text-sm font-medium">{frequency} {frequency === 1 ? 'hora' : 'horas'}</span>
                <span className="text-sm text-muted-foreground">24 horas</span>
              </div>
            </div>
          </div>
          
          <button
            className={`w-full py-2 px-4 rounded-md ${
              loading ? 'bg-gray-300' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
            onClick={saveNotificationSettings}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar configuración'}
          </button>
          
          {savedStatus && (
            <p className="text-sm text-center text-green-600">{savedStatus}</p>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="preview" className="space-y-4 mt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Estas son las frases que recibirás como recordatorio para cada ejercicio:
        </p>
        
        {Object.entries(EXERCISE_PHRASES).map(([exerciseId, phrase]) => (
          <Card key={exerciseId} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ejercicio {exerciseId}</CardTitle>
              <CardDescription>Recordatorio</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">"{phrase}"</p>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
}
