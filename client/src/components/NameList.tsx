import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import type { Name } from "@shared/schema";

interface NameListProps {
  names?: Name[];
  isLoading: boolean;
}

export default function NameList({ names = [], isLoading }: NameListProps) {
  const { toast } = useToast();
  const [newName, setNewName] = useState("");

  const addName = useMutation({
    mutationFn: async (name: string) => {
      await apiRequest("POST", "/api/names", { name, forgiven: false });
    },
    onSuccess: () => {
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
        {names.map((name) => (
          <div
            key={name.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-accent"
          >
            <Checkbox
              checked={name.forgiven}
              onCheckedChange={(checked) =>
                toggleForgiveness.mutate({
                  id: name.id,
                  forgiven: checked as boolean,
                })
              }
            />
            <span className={name.forgiven ? "line-through text-muted-foreground" : ""}>
              {name.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
