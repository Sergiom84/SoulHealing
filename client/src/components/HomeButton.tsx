import { Home } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Capacitor } from '@capacitor/core';

export default function HomeButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    console.log("Pulsado botón Home");
    
    // Detectar si estamos en entorno nativo o web
    if (Capacitor.isNativePlatform()) {
      // En entorno nativo, usar window.location para navegación más directa
      window.location.href = './index.html';
      // Alternativa: window.history.pushState({}, '', './');
    } else {
      // En entorno web, usar wouter normalmente
      setLocation("/");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed left-4 top-4"
      title="Volver a inicio"
      onClick={handleClick}
    >
      <Home className="h-5 w-5" />
      <span className="sr-only">Volver a inicio</span>
    </Button>
  );
}