import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioPlayer from "@/components/AudioPlayer";
import NameList from "@/components/NameList";
import NoteSection from "@/components/NoteSection";
import HomeButton from "@/components/HomeButton";

export default function Exercise5() {
  const [activeTab, setActiveTab] = useState("introduccion");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: names, isLoading: namesLoading } = useQuery({
    queryKey: ["/api/names"],
  });

  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["/api/notes"],
  });

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

  return (
    <div className="min-h-screen bg-background p-4">
      <HomeButton />
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      >
        <source src="/audio/leccion134.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-2xl font-light text-center mb-6">
            Lección 134: Quiero percibir el perdón tal como es.
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="introduccion">Introducción</TabsTrigger>
              <TabsTrigger value="nombres">Nombres</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="notas">Notas</TabsTrigger>
            </TabsList>

            <TabsContent value="introduccion" className="space-y-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>Intentaré ver qué es el perdón hoy. Ha sido mal entendido y se le han dado distintos significados. Se le ha hecho parecer una debilidad, un sacrificio orgulloso y altanero, un falso gesto de indulgencia y una cura que en realidad no sirve.</p>

                <p>El perdón es tranquilo y sosegado. Mira, observa y no juzga. No ataca ni se defiende. Simplemente observa y espera y no juzga. No exige nada. Es un estado mental completamente abierto, sin ningún propósito salvo el de estar dispuesto a ver las cosas de manera diferente.</p>

                <p>El perdón no tiene que ver con las apariencias ni con la conducta. No se centra en el cuerpo. Mira más allá de las apariencias, más allá de las acciones, más allá de la conducta que se observa en la superficie.</p>

                <p>Quiero hoy ver el perdón tal como es. Para ello, primero debo admitir que no sé lo que es. Y si pienso que lo sé, estoy creando obstáculos a mi aprendizaje. Quiero aprender lo que es el perdón, sin mis viejas ideas al respecto.</p>

                <p>El perdón me muestra que lo que pensaba real no lo es, y me ayuda a ver lo que por el contrario es real. El perdón es la gran liberadora de la culpa. Lo que veo como culpable no lo es, y culpa no hay.</p>

                <p>Así pues, Padre, quiero percibir el perdón tal como es. Permíteme ver la faz de Cristo resplandecer en todos aquellos a quienes miro. Enséñame a reconocer la luz de la verdad en ellos, y a ver más allá de las sombras del ego hasta su impecabilidad.</p>

                <p>Quiero contemplar a todas las personas a través de los ojos del perdón, para que pueda ver su santidad y aprender de ellos la verdad. Permíteme percibir el perdón tal como es.</p>
              </div>
            </TabsContent>

            <TabsContent value="nombres">
              <NameList names={names} isLoading={namesLoading} />
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
              <NoteSection notes={notes} isLoading={notesLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}