import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Name } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface NameListProps {
  names?: Name[];
  isLoading: boolean;
  exerciseId: number;
  userId?: string;
}

export default function NameList({ names = [], isLoading, exerciseId, userId }: NameListProps) {
  const { toast } = useToast();
  const [newName, setNewName] = useState("");

  // ✅ Clave dinámica para almacenamiento por ejercicio
  const [localNames, setLocalNames] = useLocalStorage<Name[]>(
    `forgiveness-names-${exerciseId}`,
    []
  );

  // ✅ Sincronizar nombres del servidor con localStorage solo del ejercicio actual
  useEffect(() => {
    if (names.length > 0) {
      const filtered = names.filter((n) => n.exerciseId === exerciseId);
      setLocalNames(filtered);
    }
  }, [names, exerciseId, setLocalNames]);

  // ✅ Al agregar un nombre, se guarda con su exerciseId
  const addName = useMutation({
    mutationFn: async (name: string) => {
      if (!userId) throw new Error("No hay usuario autenticado");
    
      const response = await apiRequest("POST", "/api/names", {
        name,
        forgiven: false,
        userId,
        exerciseId,
      });
    
      return response as Name;
    },
    onSuccess: (newName) => {
      setLocalNames((prev) => [...prev, newName]);
      queryClient.invalidateQueries({ queryKey: ["/api/names"] });
      setNewName("");

      toast({
        title: "Nombre agregado",
        description: "El nombre ha sido agregado a tu lista",
      });
    },
  });

  const toggleForgiveness = useMutation({
    mutationFn: async ({ id, forgiven }: { id: number; forgiven: boolean }) => {
      await apiRequest("PATCH", `/api/names/${id}`, { forgiven });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/names"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addName.mutate(newName.trim());
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ingresa un nombre para perdonar"
        />
        <Button type="submit">Agregar</Button>
      </form>

      <div className="space-y-2">
        {localNames.map((name) => (
          <div
            key={name.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-accent"
          >
            <Checkbox
              checked={name.forgiven || false}
              onCheckedChange={(checked) =>
                toggleForgiveness.mutate({
                  id: name.id,
                  forgiven: checked as boolean,
                })
              }
            />
            <div className="flex-1">
              <span className={name.forgiven ? "line-through text-muted-foreground" : ""}>
                {name.name}
              </span>
              <p className="text-xs text-muted-foreground">
                Agregado el {format(new Date(name.createdAt || new Date()), "PP", { locale: es })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
