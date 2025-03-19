import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Note } from "@shared/schema";

interface NoteSectionProps {
  notes?: Note[];
  isLoading: boolean;
}

export default function NoteSection({ notes = [], isLoading }: NoteSectionProps) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");

  const addNote = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/notes", { content });
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
          {notes.map((note) => (
            <div key={note.id} className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {new Date(note.createdAt).toLocaleDateString("es")}
              </p>
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
