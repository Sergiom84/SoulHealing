import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";

// Definir colores para cada ejercicio
const exerciseColors = {
  "1": "bg-blue-100 dark:bg-blue-900/30",
  "2": "bg-green-100 dark:bg-green-900/30",
  "3": "bg-purple-100 dark:bg-purple-900/30",
  "4": "bg-amber-100 dark:bg-amber-900/30",
  "5": "bg-rose-100 dark:bg-rose-900/30"
};

export default function ExerciseProgress() {
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Cargar el progreso al iniciar
  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('exerciseProgress') || '{}');
    if (progress[selectedDate]) {
      setSelectedExercise(progress[selectedDate]);
    }
  }, [selectedDate]);

  // Función para guardar el progreso
  const saveProgress = () => {
    if (!selectedDate || !selectedExercise) return;

    const progress = JSON.parse(localStorage.getItem('exerciseProgress') || '{}');
    progress[selectedDate] = selectedExercise;
    localStorage.setItem('exerciseProgress', JSON.stringify(progress));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed left-4 top-4">
          <CalendarIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Progreso de Ejercicios</SheetTitle>
          <SheetDescription>
            Registra los ejercicios que has completado
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full rounded-md border p-2 ${selectedExercise ? exerciseColors[selectedExercise as keyof typeof exerciseColors] : ''}`}
            />
            {selectedExercise && (
              <div className="mt-2 text-sm text-muted-foreground">
                Ejercicio seleccionado: {selectedExercise}
              </div>
            )}
          </div>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un ejercicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${exerciseColors["1"]}`} />
                Primer ejercicio
              </SelectItem>
              <SelectItem value="2" className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${exerciseColors["2"]}`} />
                Segundo ejercicio
              </SelectItem>
              <SelectItem value="3" className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${exerciseColors["3"]}`} />
                Tercer ejercicio
              </SelectItem>
              <SelectItem value="4" className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${exerciseColors["4"]}`} />
                Cuarto ejercicio
              </SelectItem>
              <SelectItem value="5" className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${exerciseColors["5"]}`} />
                Quinto ejercicio
              </SelectItem>
            </SelectContent>
          </Select>
          <Button className="mt-4 w-full" onClick={saveProgress}>
            Guardar Progreso
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}