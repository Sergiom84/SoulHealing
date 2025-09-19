import { useState, useCallback, useEffect } from 'react';

export interface LessonEntry {
  id: string;
  date: string; // formato YYYY-MM-DD
  lessonNumber: number;
  lessonTitle: string;
  completed: boolean;
  timestamp: number; // cuando se registró
}

const LESSONS = [
  { number: 1, title: "Ejercicio 1: Dios es el Amor en el que perdono." },
  { number: 2, title: "Ejercicio 2: El amor no abriga resentimientos." },
  { number: 3, title: "Ejercicio 3: Que los milagros reemplacen todos mis resentimientos." },
  { number: 4, title: "Ejercicio 4: El perdón es la llave de la felicidad." },
  { number: 5, title: "Ejercicio 5: Quiero percibir el perdón tal como es." },
  { number: 6, title: "Lección 5 : Nunca estoy disgustado por la razón que creo." },
  { number: 7, title: "Lección 20: Estoy decidido a ver." },
  { number: 8, title: "Lección 21: Estoy decidido a ver las cosas de otra manera." },
  { number: 9, title: "Lección 34: Podría ver paz en lugar de ésto." }
];

const STORAGE_KEY = 'soulhealing_lessons';

export function useLocalDatabase() {
  const [entries, setEntries] = useState<LessonEntry[]>([]);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error al cargar las entradas:', error);
        setEntries([]);
      }
    }
  }, []);

  // Guardar en localStorage cuando cambien las entradas
  const saveEntries = useCallback((newEntries: LessonEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  }, []);

  // Agregar o actualizar una lección para una fecha
  const addLessonEntry = useCallback((date: string, lessonNumber: number) => {
    const lesson = LESSONS.find(l => l.number === lessonNumber);
    if (!lesson) {
      console.error('Lección no encontrada:', lessonNumber);
      return;
    }

    const id = `${date}-${lessonNumber}`;
    const newEntry: LessonEntry = {
      id,
      date,
      lessonNumber,
      lessonTitle: lesson.title,
      completed: true,
      timestamp: Date.now()
    };

    setEntries(prevEntries => {
      // Filtrar entradas existentes para esta fecha y lección
      const filteredEntries = prevEntries.filter(entry => entry.id !== id);
      const updatedEntries = [...filteredEntries, newEntry];
      
      // Guardar en localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      
      return updatedEntries;
    });
  }, []);

  // Obtener lecciones de una fecha específica
  const getLessonsForDate = useCallback((date: string): LessonEntry[] => {
    return entries.filter(entry => entry.date === date);
  }, [entries]);

  // Eliminar una lección de una fecha
  const removeLessonEntry = useCallback((date: string, lessonNumber: number) => {
    const id = `${date}-${lessonNumber}`;
    
    setEntries(prevEntries => {
      const updatedEntries = prevEntries.filter(entry => entry.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      return updatedEntries;
    });
  }, []);

  // Verificar si una lección está completada en una fecha
  const isLessonCompleted = useCallback((date: string, lessonNumber: number): boolean => {
    const id = `${date}-${lessonNumber}`;
    return entries.some(entry => entry.id === id && entry.completed);
  }, [entries]);

  // Obtener estadísticas
  const getStats = useCallback(() => {
    const totalEntries = entries.length;
    const uniqueDates = new Set(entries.map(entry => entry.date)).size;
    const lessonCounts = entries.reduce((acc, entry) => {
      acc[entry.lessonNumber] = (acc[entry.lessonNumber] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalEntries,
      uniqueDates,
      lessonCounts
    };
  }, [entries]);

  // Obtener todas las lecciones disponibles
  const getAvailableLessons = useCallback(() => {
    return LESSONS;
  }, []);

  // Formatear fecha para mostrar
  const formatDate = useCallback((date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  return {
    entries,
    addLessonEntry,
    getLessonsForDate,
    removeLessonEntry,
    isLessonCompleted,
    getStats,
    getAvailableLessons,
    formatDate
  };
}