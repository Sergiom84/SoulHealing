import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Note } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface NoteSectionProps {
  notes?: Note[];
  isLoading: boolean;
  exerciseId: number; 
  userId?: string;
}

export default function NoteSection({ notes = [], isLoading, exerciseId, userId }: NoteSectionProps) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");

  // ✅ clave dinámica por ejercicio
  const [localNotes, setLocalNotes] = useLocalStorage<Note[]>(
    `forgiveness-notes-${exerciseId}`,
    []
  );

  // ✅ sincronizar con notas solo de este ejercicio
  useEffect(() => {
    if (notes.length > 0) {
      const filtered = notes.filter((note) => note.exerciseId === exerciseId);
      setLocalNotes(filtered);
    }
  }, [notes, exerciseId, setLocalNotes]);

  const addNote = useMutation({
    mutationFn: async (content: string) => {
      if (!userId) throw new Error("No hay usuario autenticado");
      
      const newNote = await apiRequest("POST", "/api/notes", {
        content,
        userId,
        exerciseId,
      });
    
      return newNote as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setNewNote("");
      toast({
        title: "Nota guardada",
        description: "Tu nota ha sido guardada exitosamente",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      addNote.mutate(newNote.trim());
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Escribe tus reflexiones aquí..."
          className="min-h-[100px]"
        />
        <Button type="submit" className="w-full">
          Guardar Nota
        </Button>
      </form>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {localNotes.map((note) => (
            <div key={note.id} className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {note.createdAt && format(new Date(note.createdAt), "PPpp", { locale: es })}
              </p>
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
