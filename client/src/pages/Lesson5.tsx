import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioPlayer from "@/components/AudioPlayer";
import NameList from "@/components/NameList";
import NoteSection from "@/components/NoteSection";
import HomeButton from "@/components/HomeButton";
import { Name, Note } from "@/types";
import { useUser } from "@/hooks/useUser";
import RequireAuth from "@/components/RequireAuth";

export default function Lesson5() {
  const { user } = useUser();
  const exerciseId = 6;
  const [activeTab, setActiveTab] = useState("introduccion");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audioElement = e.currentTarget;
    console.error("Error loading audio:", audioElement.error);
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background p-4 relative">
        <div className="absolute top-36 left-4">
          <HomeButton />
        </div>
        <audio
          ref={audioRef}
          onError={handleAudioError}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        >
          <source src="/audio/leccion5.mp3" type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio> 

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-light text-center mb-6">
              Lección 5: Nunca estoy disgustado por la razón que creo.
            </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="introduccion">Intro</TabsTrigger>
            <TabsTrigger value="nombres">Nombres</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
          </TabsList>

	<TabsContent value="introduccion" className="space-y-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>Esta idea puede aplicarse a cualquier persona, situación o acontecimiento que creas que te está causando dolor. Aplícala específicamente a lo que, según tú, es la causa 		de tu disgusto, y usa, para describir el sentimiento que te afecta, el término que te parezca más preciso. El disgusto puede manifestarse en forma de miedo, preocupación, 		depresión, ansiedad, ira, odio, celos o un sinnúmero de otras formas, y cada una de ellas se percibirá como diferente de las demás. Mas no es cierto que sean diferentes. 		Sin embargo, hasta que aprendas que la forma no importa, cada una de ellas constituirá materia apropiada para los ejercicios de hoy. Aplicar la misma idea a cada una de 		ellas por separado es el primer paso que te lleva a reconocer finalmente que todas son lo mismo.</p>

                <p>Al aplicar la idea de hoy a lo que percibas como la causa específica de cualquier forma de disgusto, usa el nombre del disgusto de que se trate, así como la causa que le 		atribuyes. Por ejemplo:</p>

                <ul className="list-none pl-4">
                  <li>No estoy enfadado con _____ por la razón que creo.</li>
                  <li>No tengo miedo de ____ por la razón que creo.</li>
                </ul>

                <p>Pero una vez más, esto no debe sustituir a las sesiones de práctica en las que primero examinas tu mente en busca de lo que crees son las “causas” del disgusto, y las 		formas de disgusto que, según tú, resultan de ellas.</p>

                <p>En estos ejercicios, incluso más que en los anteriores, es posible que te resulte más difícil ser imparcial y evitar concederles más importancia a unos temas que a 			otros. Tal vez te resulte útil encabezar los ejercicios con la siguiente afirmación:</p>

                  <ul className="list-none pl-4">
                  <li>No hay disgustos pequeños. Todos perturban mi paz mental por igual.</li>
                 </ul>

                <p>Luego busca en tu mente cualquier cosa que te esté afligiendo, independientemente de si te parece que te está afligiendo mucho o poco.</p>

                <p>Es posible también que te sientas menos dispuesto a aplicar la idea de hoy a algunas de las causas de los disgustos que percibes que a otras. De ocurrir eso, piensa en 		primer lugar en lo siguiente:</p>

                 <ul className="list-none pl-4">
                  <li>No puedo conservar esta forma de disgusto y al mismo tiempo desprenderme de las demás. Para los efectos de estos ejercicios, pues, las consideraré a todas como si                         		   fuesen iguales.</li>
                 </ul>

 		<p>Escudriña luego tu mente durante un minuto más o menos y trata de identificar las diferentes formas de disgustos que te estén perturbando, haciendo caso omiso de la 		relativa importancia que tal vez les atribuyas. Aplica la idea de hoy a cada una de ellas, usando el nombre de la causa del disgusto tal como la percibas y el del 			sentimiento tal como lo experimentes. Los siguientes son ejemplos adicionales:</p>

		<ul className="list-none pl-4">
                  <li>No estoy preocupado acerca de ____ por la razón que creo.</li>
		  <li>No estoy deprimido acerca de ____ por la razón que creo.</li>
                 </ul>
             

                <p>Tres o cuatro veces al día será suficiente.</p>
              </div>
            </TabsContent>

            <TabsContent value="nombres">
                <NameList
                  exerciseId={exerciseId}
                  userId={user?.id}
                />
              </TabsContent>

              <TabsContent value="audio">
                <AudioPlayer
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  volume={volume}
                  setVolume={setVolume}
                  playbackRate={playbackRate}
                  setPlaybackRate={setPlaybackRate}
                  audioRef={audioRef}
                />
              </TabsContent>

              <TabsContent value="notas">
                <NoteSection
                  exerciseId={exerciseId}
                  userId={user?.id}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}