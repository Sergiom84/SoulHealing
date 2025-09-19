import { Home } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";

export default function HomeButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    console.log("Pulsado botón Home");
    // Siempre navegar a la ruta principal usando el router
    setLocation("/");
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
