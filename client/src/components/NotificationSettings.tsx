import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLocalNotifications, ReminderTime } from '@/hooks/useLocalNotifications';
import { Bell, Plus, Trash2, TestTube } from 'lucide-react';

export default function NotificationSettings() {
  const [reminders, setReminders] = useState<ReminderTime[]>([]);
  const { scheduleReminders, testNotification, DEFAULT_REMINDERS } = useLocalNotifications();
  const { toast } = useToast();

  useEffect(() => {
    // Cargar configuración guardada
    const saved = localStorage.getItem('reminderTimes');
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      setReminders(DEFAULT_REMINDERS);
    }
  }, [DEFAULT_REMINDERS]);

  const saveReminders = async () => {
    try {
      localStorage.setItem('reminderTimes', JSON.stringify(reminders));
      await scheduleReminders(reminders);
      
      const enabledCount = reminders.filter(r => r.enabled).length;
      
      toast({
        title: "Configuración guardada",
        description: `${enabledCount} recordatorios programados correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron programar las notificaciones",
        variant: "destructive",
      });
    }
  };

  const toggleReminder = (index: number) => {
    const updated = [...reminders];
    updated[index].enabled = !updated[index].enabled;
    setReminders(updated);
  };

  const updateTime = (index: number, hour: number, minute: number) => {
    const updated = [...reminders];
    updated[index].hour = hour;
    updated[index].minute = minute;
    setReminders(updated);
  };

  const addReminder = () => {
    const newReminder: ReminderTime = {
      hour: 12,
      minute: 0,
      enabled: true,
      label: `Recordatorio ${reminders.length + 1}`
    };
    setReminders([...reminders, newReminder]);
  };

  const removeReminder = (index: number) => {
    const updated = reminders.filter((_, i) => i !== index);
    setReminders(updated);
  };

  const updateLabel = (index: number, label: string) => {
    const updated = [...reminders];
    updated[index].label = label;
    setReminders(updated);
  };

  const handleTestNotification = async () => {
    try {
      await testNotification();
      toast({
        title: "Notificación de prueba enviada",
        description: "Deberías recibir una notificación en 3 segundos",
      });
    } catch (error) {
      toast({
        title: "Error en la prueba",
        description: "No se pudo enviar la notificación de prueba",
        variant: "destructive",
      });
    }
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Configuración de Recordatorios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Configura cuando quieres recibir recordatorios para tu práctica espiritual.
          </p>
          
          {reminders.map((reminder, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleReminder(index)}
                  />
                  <div className="grid gap-1">
                    <Input
                      value={reminder.label}
                      onChange={(e) => updateLabel(index, e.target.value)}
                      className="font-medium"
                      placeholder="Nombre del recordatorio"
                    />
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReminder(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Label>Hora:</Label>
                <Input
                  type="time"
                  value={formatTime(reminder.hour, reminder.minute)}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(":");
                    const hour = Math.max(0, Math.min(23, parseInt(h || "0")));
                    const minute = Math.max(0, Math.min(59, parseInt(m || "0")));
                    updateTime(index, hour, minute);
                  }}
                  className="w-32"
                />
              </div>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={addReminder}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Agregar Recordatorio
            </Button>
            
            <Button
              variant="outline"
              onClick={handleTestNotification}
              className="flex items-center gap-2"
            >
              <TestTube size={16} />
              Probar Notificación
            </Button>
          </div>
          
          <Button onClick={saveReminders} className="w-full">
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}