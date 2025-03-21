import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Name } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface NameListProps {
  names?: Name[];
  isLoading: boolean;
}

export default function NameList({ names = [], isLoading }: NameListProps) {
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [localNames, setLocalNames] = useLocalStorage<Name[]>("forgiveness-names", []);

  // Sincronizar nombres del servidor con almacenamiento local
  useEffect(() => {
    if (names.length > 0) {
      setLocalNames(names);
    }
  }, [names, setLocalNames]);

  const addName = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/names", { name, forgiven: false });
      return response as Name;
    },
    onSuccess: (newName) => {
      // Actualizar la lista local inmediatamente
      setLocalNames(prev => [...prev, newName]);

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