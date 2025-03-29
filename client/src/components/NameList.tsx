import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Name } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNames, addName, updateNameForgiveness } from "@/hooks/useSupabaseData";

interface NameListProps {
  exerciseId: number;
  userId?: string;
}

export default function NameList({ exerciseId, userId }: NameListProps) {
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [isAddingName, setIsAddingName] = useState(false);
  const [isUpdatingForgiveness, setIsUpdatingForgiveness] = useState(false);

  // Usar el hook personalizado para obtener nombres
  const { names, loading: isLoading, error, refetch } = useNames(exerciseId, userId);

  const handleAddName = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para agregar nombres",
        variant: "destructive",
      });
      return;
    }
    
    if (!newName.trim()) return;
    
    try {
      setIsAddingName(true);
      await addName(newName.trim(), exerciseId, userId);
      setNewName("");
      
      // Refrescar la lista de nombres tras agregar
      await refetch();
      
      toast({
        title: "Nombre agregado",
        description: "El nombre ha sido agregado a tu lista",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo agregar el nombre",
        variant: "destructive",
      });
    } finally {
      setIsAddingName(false);
    }
  };

  const handleToggleForgiveness = async (id: number, forgiven: boolean) => {
    if (!userId) return;
    
    try {
      setIsUpdatingForgiveness(true);
      await updateNameForgiveness(id, forgiven);
      // Refrescar la lista de nombres tras actualizar
      await refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo actualizar el estado",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingForgiveness(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddName();
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ingresa un nombre para perdonar"
          disabled={isAddingName}
        />
        <Button type="submit" disabled={isAddingName}>
          {isAddingName ? "Agregando..." : "Agregar"}
        </Button>
      </form>

      <div className="space-y-2">
        {names.map((name) => (
          <div
            key={name.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-accent"
          >
            <Checkbox
              checked={name.forgiven || false}
              onCheckedChange={(checked) =>
                handleToggleForgiveness(name.id, checked as boolean)
              }
              disabled={isUpdatingForgiveness}
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
