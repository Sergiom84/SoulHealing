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

export default function lesson21() {
  const { user } = useUser();
  const exerciseId = 21;
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
          <source src="/audio/leccion21.mp3" type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-light text-center mb-6">
              Lección 21: Estoy decidido a ver las cosas de otra manera.
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
                <p>Inicia las sesiones de práctica repitiendo la idea en tu interior. Luego cierra los ojos y busca con minuciosidad en tu mente aquellas situaciones pasadas, presentes o previstas que susciten ira en ti. La ira puede manifestarse en cualquier clase de reacción, desde una ligera irritación hasta la furia más desenfrenada. El grado de intensidad de la emoción experimentada es irrelevante. Te irás dando cuenta cada vez más de que una leve punzada de molestia no es otra cosa que un velo que cubre una intensa furia.</p>

                <p>Trata, por lo tanto, durante las sesiones de práctica, de no dejar escapar aquellos pensamientos de ira que consideras "insignificantes". Recuerda que no reconoces realmente qué es lo que suscita ira en ti, y nada de lo que puedas creer al respecto tiene significado alguno. Probablemente te sentirás tentado de emplear más tiempo en ciertas situaciones o personas que en otras, sobre la falsa base de que son más "obvias". Esto no es cierto. Es meramente un ejemplo de la creencia de que ciertas formas de ataque están más justificadas que otras.</p>

                <p>Al escudriñar tu mente en busca de todas las formas en que se presentan los pensamientos de ataque, mantén cada uno de ellos presente mientras te dices a ti mismo:</p>
                <ul className="list-none pl-4">
                  <li>Estoy decidido a ver a ___ [nombre de la persona] de otra manera.</li>
                  <li>Estoy decidido a ver ___ [especifica la situación] de otra manera.</li>
                </ul>

                <p>Trata de ser tan específico como te sea posible. Puede, por ejemplo, que concentres tu ira en una característica determinada de alguna persona en particular, creyendo que la ira se limita a ese aspecto. Si tu percepción sufre de esa forma de distorsión, di:</p>
                <ul className="list-none pl-4">
                  <li>Estoy decidido a ver [especifica la característica] de [nombre de la persona] de otra manera.</li>
                </ul>

                <p>Se te exhorta a que lleves a cabo cinco sesiones de práctica de un minuto completo cada una.</p>
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
