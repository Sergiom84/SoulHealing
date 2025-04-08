import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExerciseRecords, addExerciseRecord, ExerciseRecord } from '@/hooks/useExerciseCalendar';

interface CalendarProps {
  userId?: string;
}

const exerciseOptions = [
  { id: 1, name: 'Lección 46: Dios es el Amor en el que perdono' },
  { id: 2, name: 'Lección 68: El amor no abriga resentimientos' },
  { id: 3, name: 'Lección 78: Que los milagros reemplacen todos mis resentimientos' },
  { id: 4, name: 'Lección 121: El perdón es la llave de la felicidad' },
  { id: 5, name: 'Lección 134: Quiero percibir el perdón tal como es' },
  { id: 6, name: 'Lección 5: Nunca estoy disgustado por la razón que creo' },
  { id: 7, name: 'Lección 20: Estoy decidido a ver' },
  { id: 8, name: 'Lección 21: Estoy decidido a ver las cosas de otra manera' },
  { id: 9, name: 'Lección 34: Podría ver paz en lugar de ésto' },
];

// Colores más distinguibles para los ejercicios
const exerciseColors = [
  'bg-blue-500',    // Lección 46: Dios es el Amor en el que perdono
  'bg-green-500',   // Lección 68: El amor no abriga resentimientos
  'bg-yellow-500',  // Lección 78: Que los milagros reemplacen todos mis resentimientos
  'bg-purple-500',  // Lección 121: El perdón es la llave de la felicidad
  'bg-pink-500',    // Lección 134: Quiero percibir el perdón tal como es
  'bg-red-500',     // Lección 5: Nunca estoy disgustado por la razón que creo
  'bg-teal-500',    // Lección 20: Estoy decidido a ver
  'bg-indigo-500',  // Lección 21: Estoy decidido a ver las cosas de otra manera
  'bg-orange-500',  // Lección 34: Podría ver paz en lugar de ésto
];

export default function ExerciseCalendar({ userId }: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  const { records, loading, refetch } = useExerciseRecords(userId);

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    setCalendarDays(days);
  }, [currentMonth]);

  const getExerciseForDay = (day: Date): ExerciseRecord | undefined => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return records.find(record => record.completedDate === dateStr);
  };

  const handleSaveExercise = async () => {
    if (!userId || !selectedDate || !selectedExercise) return;

    try {
      setSaving(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      await addExerciseRecord(userId, parseInt(selectedExercise), dateStr);
      await refetch();
      setIsOpen(false);
      setSelectedDate(null);
      setSelectedExercise('');
    } catch (error) {
      console.error('Error al guardar el ejercicio:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    const existingRecord = getExerciseForDay(day);
    if (existingRecord) {
      setSelectedExercise(existingRecord.exerciseId.toString());
    } else {
      setSelectedExercise('');
    }
  };

  const getDayColor = (day: Date): string => {
    const record = getExerciseForDay(day);
    if (!record) return '';
    const colorIndex = (record.exerciseId - 1) % exerciseColors.length;
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
                    {exerciseOptions.map(option => (
                      <SelectItem 
                        key={option.id} 
                        value={option.id.toString()}
                        className="hover:bg-accent hover:text-accent-foreground"
                      >
                        {option.name}
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

          <div className="flex flex-wrap gap-2 mt-4">
            {exerciseOptions.map((option, index) => (
              <div key={option.id} className="flex items-center gap-1 text-xs">
                <div className={`w-3 h-3 rounded-full ${exerciseColors[index % exerciseColors.length]}`} />
                <span>Ejercicio {option.id}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
