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

export default function Lesson20() {
  const { user } = useUser();
  const exerciseId = 20;
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
          <source src="/audio/leccion20.mp3" type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-light text-center mb-6">
              Lección 20: Estoy decidido a ver.
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
                <p>Los ejercicios de hoy consisten en que te recuerdes a ti mismo a lo largo del día que quieres ver. La idea de hoy implica tácitamente también el reconocimiento de que ahora no ves. Por lo tanto, cada vez que repites la idea, estás afirmando que estás decidido a cambiar tu estado actual por uno mejor, por uno que realmente deseas.</p>

                <p>Repite la idea de hoy lentamente y a conciencia por lo menos dos veces por hora, y trata de hacerlo cada media hora. No te desanimes si se te olvida hacerlo, pero esfuérzate al máximo por acordarte. Las repeticiones adicionales deben aplicarse a cualquier situación, persona o acontecimiento que te perturbe. Puedes verlos de otra manera, y los verás. Verás lo que desees ver. Ésta es la verdadera ley de causa y efecto tal como opera en el mundo.</p>
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
