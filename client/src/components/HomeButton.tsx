import { Home } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";

export default function HomeButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    console.log("Botón Home pulsado");
    if (Capacitor.isNativePlatform()) {
      // En entorno nativo, recargar la página principal
      window.location.href = "./index.html";
    } else {
      // En entorno web, navegar con el router SPA
      setLocation("/");
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      title="Volver a inicio" 
      onClick={handleClick}
      /* Nota: Se removieron las clases fixed top-4 left-4 */
    >
      <Home className="h-5 w-5" />
      <span className="sr-only">Volver a inicio</span>
    </Button>
  );
}
