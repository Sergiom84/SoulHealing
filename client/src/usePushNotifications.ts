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
      console.log("📲 Token recibido:", !!token.value);
    });

    // Error al registrar
    PushNotifications.addListener("registrationError", err => {
      console.error("❌ Error al registrar el dispositivo", err);
    });

    // Notificación recibida en primer plano
    PushNotifications.addListener("pushNotificationReceived", notification => {
      console.log("📥 Notificación recibida", !!notification);
    });

    // Notificación tocada desde el centro de notificaciones
    PushNotifications.addListener("pushNotificationActionPerformed", action => {
      console.log("👆 Notificación abierta", !!action.notification);
    });
  }, []);
}
