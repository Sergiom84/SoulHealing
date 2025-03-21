import { Home } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomeButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation("/exercise");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-4 left-4"
      title="Volver a ejercicios"
      onClick={handleClick}
    >
      <Home className="h-[1.5rem] w-[1.5rem]" />
      <span className="sr-only">Volver a ejercicios</span>
    </Button>
  );
}