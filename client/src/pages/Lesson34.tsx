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

export default function Lesson34() {
  const { user } = useUser();
  const exerciseId = 34;
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
          <source src="/audio/leccion34.mp3" type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-light text-center mb-6">
              Lección 34: Podría ver paz en lugar de ésto.
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
                <p>La idea de hoy comienza a describir las condiciones que prevalecen en la otra manera de ver. La paz mental es claramente una cuestión interna. Tiene que empezar con tus propios pensamientos y luego extenderse hacia afuera. Es de tu paz mental de donde nace una percepción pacífica del mundo.</p>

                <p>Escudriña tu mente en busca de pensamientos de temor, situaciones que provoquen ansiedad, personas o acontecimientos "ofensivos" o cualquier otra cosa sobre la que estés abrigando pensamientos no amorosos. A medida que cada uno de estos pensamientos surja en tu mente, obsérvalo relajadamente, repitiendo la idea de hoy muy despacio, y luego déjalo ir y haz lo mismo con el siguiente.</p>

                <p>Si comienza a resultarte difícil pensar en temas específicos, continúa repitiendo la idea para tus adentros sin prisas y sin aplicarla a nada en particular. Asegúrate, no obstante, de no excluir nada específicamente.</p>

                <p>Las aplicaciones cortas deben ser frecuentes, y hacerse siempre que sientas que de alguna forma tu paz mental se está viendo amenazada. El propósito de esto es protegerte de la tentación a lo largo del día. Si se presentase alguna forma específica de tentación en tu conciencia, el ejercicio deberá hacerse de esta forma:</p>
                <ul className="list-none pl-4">
                  <li>Podría ver paz en esta situación en lugar de lo que ahora veo en ella.</li>
                </ul>

                <p>Si los ataques a tu paz mental se manifiestan en forma de emociones adversas más generalizadas, tales como depresión, ansiedad o preocupación, usa la idea en su forma original. Si ves que necesitas aplicar la idea de hoy más de una vez para que te ayude a cambiar de parecer con respecto a alguna situación determinada, trata de dedicar varios minutos a repetirla hasta que sientas una sensación de alivio. Te ayudará si te dices a ti mismo lo siguiente:</p>
                <ul className="list-none pl-4">
                  <li>Puedo sustituir mis sentimientos de depresión, ansiedad o preocupación [o mis pensamientos acerca de esta situación, persona o acontecimiento] por paz.</li>
                </ul>

                <p>Para los ejercicios de hoy, realiza tres sesiones largas: una por la mañana, otra por la noche y una tercera cuando lo consideres oportuno. Todas las sesiones deben hacerse con los ojos cerrados, dirigiendo la práctica a tu mundo interno. Dedica unos cinco minutos a cada sesión.</p>
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
