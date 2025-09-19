import { useCallback } from 'react';
import { LocalNotifications, PermissionStatus } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface ReminderTime {
  hour: number;
  minute: number;
  enabled: boolean;
  label: string;
}

const DEFAULT_REMINDERS: ReminderTime[] = [
  { hour: 9, minute: 0, enabled: true, label: "Mañana" },
  { hour: 15, minute: 0, enabled: true, label: "Tarde" },
  { hour: 21, minute: 0, enabled: true, label: "Noche" }
];

const MOTIVATIONAL_MESSAGES = [
  "Es momento de tu práctica de perdón 🙏",
  "Tu rutina de sanación te está esperando ✨",
  "Dedica unos minutos a la paz interior 🕊️",
  "El perdón es el regalo que te das a ti mismo 💝",
  "Un momento de reflexión puede transformar tu día 🌅",
  "Tu práctica espiritual te fortalece 💪",
  "El amor siempre vence al miedo ❤️",
  "Respira y conecta con tu ser interior 🧘‍♀️"
];

export function useLocalNotifications() {
  const checkPermissions = useCallback(async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      console.log("🌐 Notificaciones no disponibles en web");
      return false;
    }

    try {
      const status = await LocalNotifications.checkPermissions();
      
      if (status.display === 'granted') {
        return true;
      }
      
      const requestResult = await LocalNotifications.requestPermissions();
      return requestResult.display === 'granted';
    } catch (error) {
      console.error("Error al verificar permisos:", error);
      return false;
    }
  }, []);

  const initializeNotifications = useCallback(async () => {
    const hasPermissions = await checkPermissions();
    if (!hasPermissions) {
      throw new Error("Permisos de notificación denegados");
    }

    // Cancelar notificaciones pendientes
    await LocalNotifications.cancel({ notifications: [] });
    
    console.log("✅ Notificaciones locales inicializadas");
  }, [checkPermissions]);

  const scheduleReminders = useCallback(async (times: ReminderTime[]) => {
    const hasPermissions = await checkPermissions();
    if (!hasPermissions) {
      console.log("❌ Sin permisos para notificaciones");
      return;
    }

    try {
      // Cancelar notificaciones existentes
      await LocalNotifications.cancel({ notifications: [] });

      const notifications = times
        .filter(time => time.enabled)
        .map((time, index) => {
          const now = new Date();
          const scheduleDate = new Date();
          scheduleDate.setHours(time.hour, time.minute, 0, 0);

          // Si ya pasó la hora de hoy, programar para mañana
          if (scheduleDate <= now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
          }

          const randomMessage = MOTIVATIONAL_MESSAGES[
            Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
          ];

          return {
            id: index + 1,
            title: "SoulHealing - Rutina de Perdón",
            body: randomMessage,
            schedule: {
              on: { hour: time.hour, minute: time.minute },
              repeats: true
            },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: {
              reminderType: time.label
            }
          };
        });

      if (notifications.length > 0) {
        await LocalNotifications.schedule({
          notifications
        });
        
        console.log(`🔔 ${notifications.length} recordatorios programados`);
      }
    } catch (error) {
      console.error("Error al programar recordatorios:", error);
      throw error;
    }
  }, [checkPermissions]);

  const cancelAllNotifications = useCallback(async () => {
    try {
      await LocalNotifications.cancel({ notifications: [] });
      console.log("🔕 Todas las notificaciones canceladas");
    } catch (error) {
      console.error("Error al cancelar notificaciones:", error);
    }
  }, []);

  const testNotification = useCallback(async () => {
    const hasPermissions = await checkPermissions();
    if (!hasPermissions) {
      alert("Permisos de notificación requeridos");
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [{
          id: 999,
          title: "🧪 Prueba - SoulHealing",
          body: "Esta es una notificación de prueba. ¡Todo funciona correctamente! ✅",
          schedule: {
            at: new Date(Date.now() + 3000) // En 3 segundos
          }
        }]
      });
      
      console.log("🧪 Notificación de prueba programada para 3 segundos");
    } catch (error) {
      console.error("Error en notificación de prueba:", error);
    }
  }, [checkPermissions]);

  return {
    initializeNotifications,
    scheduleReminders,
    cancelAllNotifications,
    testNotification,
    checkPermissions,
    DEFAULT_REMINDERS
  };
}