import { Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomeButton() {
  return (
    <Link href="/exercise">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4"
        title="Volver a ejercicios"
      >
        <Home className="h-[1.5rem] w-[1.5rem]" />
        <span className="sr-only">Volver a ejercicios</span>
      </Button>
    </Link>
  );
}