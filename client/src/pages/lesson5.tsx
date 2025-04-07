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

export default function lesson5() {
  const { user } = useUser();
  const exerciseId = 5;
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
    if (audioElement.error) {
      console.error("Error loading audio:", audioElement.error.message);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background p-4 relative">
        <div className="absolute top-36 left-4">
          <HomeButton />
        </div>
        <audio
          ref={(el) => {
            if (el) audioRef.current = el;
          }}
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
            <img src="/images/1.png" alt="Imagen de Lección 5" className="w-full h-auto mb-4" />
            <h1 className="text-2xl font-light text-center mb-6">
              Lección 5: Nunca estoy disgustado por la razón que creo.
            </h1>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="introduccion">Intro</TabsTrigger>
            <TabsTrigger value="nombres">Nombres</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </RequireAuth>
  );
}
