import { Home } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomeButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    console.log("Pulsado botón Home");

    // Navegación uniforme para web y plataforma nativa
    setLocation("/");
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