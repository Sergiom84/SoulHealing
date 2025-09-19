import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Name } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
// import { useNames, addName, updateNameForgiveness } from "@/hooks/useSupabaseData"; // Comentado - usando sistema local
import { useLocalNames } from "@/hooks/useLocalStorage";

interface NameListProps {
  exerciseId: number;
  userId?: string;
}

export default function NameList({ exerciseId, userId }: NameListProps) {
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [isAddingName, setIsAddingName] = useState(false);
  const [isUpdatingForgiveness, setIsUpdatingForgiveness] = useState(false);
  const [isDeletingName, setIsDeletingName] = useState(false);

  // Usar el hook local para obtener nombres
  const { names, loading: isLoading, error, addName: addLocalName, updateNameForgiveness: updateLocalForgiveness, deleteName: deleteLocalName, refetch } = useLocalNames(exerciseId);

  const handleAddName = async () => {
    if (!newName.trim()) return;
    
    try {
      setIsAddingName(true);
      await addLocalName(newName.trim());
      setNewName("");
      
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
    try {
      setIsUpdatingForgiveness(true);
      await updateLocalForgiveness(id, forgiven);
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

  const handleDeleteName = async (id: number) => {
    try {
      setIsDeletingName(true);
      await deleteLocalName(id);
      toast({
        title: "Nombre eliminado",
        description: "El nombre ha sido eliminado de tu lista",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo eliminar el nombre",
        variant: "destructive",
      });
    } finally {
      setIsDeletingName(false);
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteName(name.id)}
              disabled={isDeletingName}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
