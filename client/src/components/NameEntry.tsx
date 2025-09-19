import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function NameEntry() {
  const [name, setName] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Guardar el nombre en localStorage
      localStorage.setItem('userName', name.trim());
      setLocation("/"); // Navegar a la página principal
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-serif">
              SoulHealing
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Para acceder: Introduce tu nombre
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-center"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!name.trim()}
              >
                Continuar
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}