import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
// import { useNotes, addNote } from "@/hooks/useSupabaseData"; // Comentado - usando sistema local
import { useLocalNotes } from "@/hooks/useLocalStorage";

interface NoteSectionProps {
  exerciseId: number;
  userId?: string;
}

export default function NoteSection({ exerciseId, userId }: NoteSectionProps) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isDeletingNote, setIsDeletingNote] = useState(false);
  const [isUpdatingRead, setIsUpdatingRead] = useState(false);

  // Hook local para notas
  const { notes, loading: isLoading, error, addNote: addLocalNote, updateNoteRead: updateLocalRead, deleteNote: deleteLocalNote, refetch } = useLocalNotes(exerciseId);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setIsAddingNote(true);
      await addLocalNote(newNote.trim());
      setNewNote("");

      toast({
        title: "Nota guardada",
        description: "Tu nota ha sido guardada exitosamente",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo guardar la nota",
        variant: "destructive",
      });
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleToggleRead = async (id: number, read: boolean) => {
    try {
      setIsUpdatingRead(true);
      await updateLocalRead(id, read);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo actualizar el estado",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingRead(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      setIsDeletingNote(true);
      await deleteLocalNote(id);
      toast({
        title: "Nota eliminada",
        description: "La nota ha sido eliminada exitosamente",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo eliminar la nota",
        variant: "destructive",
      });
    } finally {
      setIsDeletingNote(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddNote();
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Escribe tus reflexiones aquí..."
          className="min-h-[100px]"
          disabled={isAddingNote}
        />
        <Button type="submit" className="w-full" disabled={isAddingNote}>
          {isAddingNote ? "Guardando..." : "Guardar Nota"}
        </Button>
      </form>

      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-accent"
          >
            <Checkbox
              checked={note.read || false}
              onCheckedChange={(checked) =>
                handleToggleRead(note.id, checked as boolean)
              }
              disabled={isUpdatingRead}
            />
            <div className="flex-1">
              <span className={note.read ? "line-through text-muted-foreground" : ""}>
                {note.content}
              </span>
              <p className="text-xs text-muted-foreground">
                Agregado el {note.createdat && format(new Date(note.createdat), "PP", { locale: es })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteNote(note.id)}
              disabled={isDeletingNote}
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
