import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioPlayer from "@/components/AudioPlayer";
import NameList from "@/components/NameList";
import NoteSection from "@/components/NoteSection";
import HomeButton from "@/components/HomeButton";
import { Name, Note } from "@/types";
// import { useUser } from "@/hooks/useUser"; // Comentado - usando sistema simplificado
import { useSimpleUser } from "@/hooks/useSimpleUser";
import RequireAuth from "@/components/RequireAuth";

export default function Exercise4() {
  const { user } = useSimpleUser();
  const exerciseId = 4;
  const [activeTab, setActiveTab] = useState("introduccion");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ya no necesitamos las consultas de React Query, usamos nuestros hooks personalizados directamente en los componentes

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

  const handleAudioError = () => {
    console.error("Error loading audio file.");
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background p-4">
        <HomeButton />
        <audio
          ref={audioRef}
          onError={handleAudioError}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        >
          <source src="/audio/leccion121.mp3" type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-light text-center mb-6">
              Lección 121: El perdón es la llave de la felicidad.
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
                <p>Comienza la sesión de práctica pensando en alguien que no te cae bien. Alguien que te irrite, alguien con quien lamentarías haberte encontrado, alguien a quien detestas vehementemente o que simplemente tratas de ignorar.</p>

                <p>La forma en que tu hostilidad se manifiesta es irrelevante. Probablemente ya sabes de quién se trata. Ese mismo vale.</p>

                <p>Cierra los ojos y visualízalo en tu mente. Míralo por un rato. Trata de percibir algún atisbo de luz en alguna parte de él, algún pequeño destello que nunca antes habías notado.</p>

                <p>Trata de encontrar alguna chispa de luminosidad brillando a través de la desagradable imagen que de él has formado. Continúa contemplando esa imagen hasta que veas luz en alguna parte de ella, y trata entonces de que esa luz se expanda hasta envolver a dicha persona y transforme esa imagen en algo bueno y hermoso.</p>

                <p>Contempla esta nueva percepción por un rato y luego trae a tu mente la imagen de alguien a quien consideras un amigo. Trata de transferirle a este la luz que aprendiste a ver en torno de quien antes era tu enemigo. Percíbelo ahora como algo más que un amigo, pues en esa luz su santidad te muestra a tu salvador, salvado y salvando, sano e íntegro.</p>

                <p>Tomamos a alguien a quien no podemos ver con amor y tratamos de encontrar en él una cualidad positiva. Entonces, vemos un punto de luz en esa cualidad y, al final, esta cualidad, esta luz, tratamos de extenderla a toda la imagen. Cuando tenemos toda la imagen envuelta en la luz, la colocamos junto a un amigo y trasladamos esa luz de nuestro "enemigo" a nuestro amigo.</p>

                <p>Percíbelo ahora como algo más que un amigo, pues en esa luz su santidad te muestra a tu salvador, salvando y salvado, sano e íntegro.</p>

                <p>Permite entonces que él te ofrezca la luz que ves en él. Tu amigo tiene la luz de tu enemigo y permite que te ofrezca esa luz. Y deja que tu "enemigo" y tu amigo se unan para bendecirte con lo que tú les diste.</p>

                <p>Ahora eres uno con ellos, tal como ellos son uno contigo.</p>

                <p>Ahora te has perdonado a ti mismo.</p>

                <p>El perdón es la llave de la felicidad. Despertaré del sueño de que soy mortal, falible y lleno de pecado, y sabré que soy el Hijo de Dios.</p>
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