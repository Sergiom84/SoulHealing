/* PUSH NOTIFICATIONS DESHABILITADAS - AHORA USANDO NOTIFICACIONES LOCALES
import { useEffect } from "react";
import { PushNotifications } from "@capacitor/push-notifications";

export function usePushNotifications() {
  useEffect(() => {
    // Solicitar permiso para recibir notificaciones
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === "granted") {
        PushNotifications.register();
      }
    });

    // Token asignado al dispositivo
    PushNotifications.addListener("registration", token => {
      const tokenLength = token.value.length;
      console.log("📲 Token recibido. Longitud:", tokenLength);
    });

    // Error al registrar
    PushNotifications.addListener("registrationError", err => {
      console.error("❌ Error al registrar el dispositivo", err);
    });

    // Notificación recibida en primer plano
    PushNotifications.addListener("pushNotificationReceived", notification => {
      console.log("📥 Notificación recibida");
    });

    // Notificación tocada desde el centro de notificaciones
    PushNotifications.addListener("pushNotificationActionPerformed", action => {
      console.log("👆 Notificación abierta");
    });
  }, []);
}
*/

import { useEffect } from "react";
import { useLocalNotifications } from "./hooks/useLocalNotifications";

// Nueva función usando notificaciones locales
export function usePushNotifications() {
  const { initializeNotifications, scheduleReminders } = useLocalNotifications();

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        await initializeNotifications();
        
        // Programar recordatorios basados en configuración del usuario
        const savedReminders = localStorage.getItem('reminderTimes');
        if (savedReminders) {
          const times = JSON.parse(savedReminders);
          await scheduleReminders(times);
        }
        
        console.log("🔔 Notificaciones locales inicializadas correctamente");
      } catch (error) {
        console.error("❌ Error al configurar notificaciones locales:", error);
      }
    };

    setupNotifications();
  }, [initializeNotifications, scheduleReminders]);
}
