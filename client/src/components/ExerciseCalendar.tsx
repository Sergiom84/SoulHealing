import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocalDatabase } from '@/hooks/useLocalDatabase';
import { useToast } from '@/hooks/use-toast';

interface CalendarProps {
  // No necesitamos userId ahora que usamos almacenamiento local
}

// Colores para las lecciones
const exerciseColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-red-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-orange-500',
];

export default function ExerciseCalendar({}: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  const { addLessonEntry, getLessonsForDate, removeLessonEntry, getAvailableLessons } = useLocalDatabase();
  const { toast } = useToast();

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    setCalendarDays(days);
  }, [currentMonth]);

  const getExerciseForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const lessons = getLessonsForDate(dateStr);
    return lessons.length > 0 ? lessons[0] : null; // Retornar la primera lección del día
  };

  const handleSaveExercise = async () => {
    if (!selectedDate || !selectedExercise) return;

    try {
      setSaving(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const lessonNumber = parseInt(selectedExercise);
      
      // Eliminar lección existente si la hay
      const existingLessons = getLessonsForDate(dateStr);
      existingLessons.forEach(lesson => {
        removeLessonEntry(dateStr, lesson.lessonNumber);
      });
      
      // Agregar nueva lección
      addLessonEntry(dateStr, lessonNumber);
      
      const lessonObj = getAvailableLessons().find(l => l.number === lessonNumber);
      const label = lessonObj ? lessonObj.title : `Ejercicio ${lessonNumber}`;

      toast({
        title: "Lección guardada",
        description: `${label} registrado para ${format(selectedDate, 'dd/MM/yyyy')}`,
      });
      
      setSelectedDate(null);
      setSelectedExercise('');
    } catch (error) {
      console.error('Error al guardar el ejercicio:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la lección",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const existingLesson = getExerciseForDay(day);
    if (existingLesson) {
      setSelectedExercise(existingLesson.lessonNumber.toString());
    } else {
      setSelectedExercise('');
    }
  };

  const getDayColor = (day: Date): string => {
    const lesson = getExerciseForDay(day);
    if (!lesson) return '';
    const colorIndex = (lesson.lessonNumber - 1) % exerciseColors.length;
    return exerciseColors[colorIndex];
  };

  const previousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>Calendario</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Calendario de Ejercicios</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              &lt;
            </Button>
            <h2 className="text-center font-medium">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              &gt;
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["D", "L", "M", "X", "J", "V", "S"].map((day, index) => (
              <div key={index} className="font-medium text-sm py-1">
                {day}
              </div>
            ))}

            {Array.from({ length: calendarDays[0]?.getDay() || 0 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}

            {calendarDays.map(day => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const dayColor = getDayColor(day);
              return (
                <Button
                  key={day.toString()}
                  variant="ghost"
                  className={`h-10 w-10 p-0 ${dayColor} ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  {format(day, 'd')}
                </Button>
              );
            })}
          </div>

          {selectedDate && (
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm">
                  {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 space-y-2">
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger className="bg-background text-foreground">
                    <SelectValue placeholder="Selecciona un ejercicio" />
                  </SelectTrigger>
                  <SelectContent className="bg-background text-foreground">
                    {getAvailableLessons().map(lesson => (
                      <SelectItem 
                        key={lesson.number} 
                        value={lesson.number.toString()}
                        className="hover:bg-accent hover:text-accent-foreground"
                      >
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={handleSaveExercise}
                  disabled={!selectedExercise || saving}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </CardContent>
            </Card>
          )}


        </div>
      </DialogContent>
    </Dialog>
  );
}
