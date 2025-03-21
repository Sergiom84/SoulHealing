import { Home } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomeButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation("/");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed left-4 top-4"
      title="Volver a ejercicios"
      onClick={handleClick}
    >
      <Home className="h-5 w-5" />
      <span className="sr-only">Volver a ejercicios</span>
    </Button>
  );
}