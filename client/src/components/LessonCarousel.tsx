import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Datos de las lecciones con el texto actualizado proporcionado por el usuario
const lessonData = [
  {
    id: "lesson5",
    title: "Lección 5",
    description: "Nunca estoy disgustado por la razón que creo.",
    imageSrc: "/images/lessons/1.png",
  },
  {
    id: "lesson20",
    title: "Lección 20",
    description: "Estoy decidido a ver.",
    imageSrc: "/images/lessons/2.png",
  },
  {
    id: "lesson21",
    title: "Lección 21",
    description: "Estoy decidido a ver las cosas de otra manera.",
    imageSrc: "/images/lessons/3.png",
  },
  {
    id: "lesson34",
    title: "Lección 34",
    description: "Podría ver paz en lugar de esto.",
    imageSrc: "/images/lessons/4.png",
  },
];

const LessonCarousel: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16">
      <h2 className="text-2xl font-serif mb-6 text-center">Lecciones Avanzadas</h2>
      
      {/* Versión para escritorio - visible solo en pantallas medianas y grandes */}
      <div className="hidden md:block">
        <Carousel className="w-full">
          <CarouselContent>
            {lessonData.map((lesson) => (
              <CarouselItem key={lesson.id} className="md:basis-1/2 lg:basis-1/2">
                <Link href={`/${lesson.id}`}>
                  <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 min-h-[250px]">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={lesson.imageSrc} 
                          alt={`Imagen de ${lesson.title}`} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          style={{ objectPosition: 'center' }}
                        />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
                      <p className="text-muted-foreground">{lesson.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-2 mt-4">
            <CarouselPrevious className="static transform-none mx-2" />
            <CarouselNext className="static transform-none mx-2" />
          </div>
        </Carousel>
      </div>
      
      {/* Versión para móvil - visible solo en pantallas pequeñas */}
      <div className="block md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {lessonData.map((lesson) => (
              <CarouselItem key={lesson.id} className="basis-full">
                <Link href={`/${lesson.id}`}>
                  <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 min-h-[250px]">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={lesson.imageSrc} 
                          alt={`Imagen de ${lesson.title}`} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          style={{ objectPosition: 'center' }}
                        />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
                      <p className="text-muted-foreground">{lesson.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-2 mt-4">
            <CarouselPrevious className="static transform-none mx-2" />
            <CarouselNext className="static transform-none mx-2" />
          </div>
        </Carousel>
      </div>
      
      {/* Indicadores de posición del carrusel */}
      <div className="flex justify-center gap-2 mt-4">
        {lessonData.map((_, index) => (
          <div
            key={index}
            className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"
          />
        ))}
      </div>
    </div>
  );
};

export default LessonCarousel;
