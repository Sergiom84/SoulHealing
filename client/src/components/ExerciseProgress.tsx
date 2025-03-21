import { useState } from 'react';
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
import { ListTodo } from "lucide-react";

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

  // Función para guardar el progreso
  const saveProgress = () => {
    if (!selectedExercise) return;

    // Guardar el ejercicio seleccionado
    const progress = JSON.parse(localStorage.getItem('exerciseProgress') || '{}');
    const today = new Date().toISOString().split('T')[0];
    progress[today] = selectedExercise;
    localStorage.setItem('exerciseProgress', JSON.stringify(progress));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed left-4 top-4">
          <ListTodo className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Progreso de Ejercicios</SheetTitle>
          <SheetDescription>
            Registra el ejercicio que has completado hoy
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="relative mb-4">
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
            {selectedExercise && (
              <div className="mt-2 text-sm text-muted-foreground">
                Ejercicio seleccionado: {selectedExercise}
              </div>
            )}
          </div>
          <Button className="mt-4 w-full" onClick={saveProgress}>
            Guardar Progreso
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}