import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNotes, addNote } from "@/hooks/useSupabaseData";

interface NoteSectionProps {
  exerciseId: number;
  userId?: string;
}

export default function NoteSection({ exerciseId, userId }: NoteSectionProps) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Hook que incluye refetch para refrescar automáticamente
  const { notes, loading: isLoading, error, refetch } = useNotes(exerciseId, userId);

  const handleAddNote = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para agregar notas",
        variant: "destructive",
      });
      return;
    }

    if (!newNote.trim()) return;

    try {
      setIsAddingNote(true);
      await addNote(newNote.trim(), exerciseId, userId);
      setNewNote("");
      await refetch(); // ✅ Refresca automáticamente

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

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {note.createdat && format(new Date(note.createdat), "PPpp", { locale: es })}
              </p>
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
