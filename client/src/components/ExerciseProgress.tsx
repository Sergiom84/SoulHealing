import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
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

export default function ExerciseProgress() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  // Función para guardar el progreso
  const saveProgress = () => {
    if (!date || !selectedExercise) return;

    const progress = JSON.parse(localStorage.getItem('exerciseProgress') || '{}');
    const dateKey = date.toISOString().split('T')[0];

    progress[dateKey] = selectedExercise;
    localStorage.setItem('exerciseProgress', JSON.stringify(progress));
  };

  // Función para obtener el progreso de una fecha
  const getProgress = (date: Date) => {
    const progress = JSON.parse(localStorage.getItem('exerciseProgress') || '{}');
    const dateKey = date.toISOString().split('T')[0];
    return progress[dateKey];
  };

  // Función para renderizar el contenido del día
  const renderDayContent = (day: Date) => {
    const exercise = getProgress(day);
    if (!exercise) return null;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-[10px] font-semibold"
        >
          {exercise}
        </div>
      </div>
    );
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
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => renderDayContent(date)
            }}
          />
          <div className="mt-4">
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un ejercicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Primer ejercicio</SelectItem>
                <SelectItem value="2">Segundo ejercicio</SelectItem>
                <SelectItem value="3">Tercer ejercicio</SelectItem>
                <SelectItem value="4">Cuarto ejercicio</SelectItem>
                <SelectItem value="5">Quinto ejercicio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="mt-4 w-full" onClick={saveProgress}>
            Guardar Progreso
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}