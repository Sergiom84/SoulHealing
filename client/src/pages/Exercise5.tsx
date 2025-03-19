import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import NameList from "@/components/NameList";
import NoteSection from "@/components/NoteSection";

export default function Exercise5() {
  const [activeTab, setActiveTab] = useState("instrucciones");
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

  // Añadimos un manejador de errores para el audio
  const handleAudioError = (e: Event) => {
    const audioElement = e.target as HTMLAudioElement;
    console.error('Error loading audio:', audioElement.error);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <audio
        ref={audioRef}
        onError={handleAudioError}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      >
        <source src="/attached_assets/Quinto ejercicio_UCDM.wav" type="audio/wav" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-2xl font-light text-center mb-6">
            Lección 134. Quiero percibir el perdón tal como es.
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="instrucciones">Instrucciones</TabsTrigger>
              <TabsTrigger value="nombres">Nombres</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="notas">Notas</TabsTrigger>
            </TabsList>

            <TabsContent value="instrucciones" className="space-y-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>Escoge a un hermano, tal como el Espíritu te indique, y cataloga sus pecados uno por uno a medida que crucen tu mente.</p>

                <p>Asegúrate de no concentrarte en ninguno de ellos en particular; antes bien, date cuenta de que te estás valiendo de sus ofensas para salvar al mundo de toda idea de pecado.</p>

                <p>Examina brevemente todas las cosas negativas que hayas pensado acerca de él y pregúntate en cada caso: "¿Me condenaría a mí mismo por haber hecho esto?"</p>

                <p>Libéralo de todos los pensamientos de pecado que hayas tenido en relación con él, y tú mismo estarás preparado para ser libre.</p>

                <p>Si has estado practicando hasta ahora de buen grado y con honestidad, empezarás a notar una sensación de elevación, un gran alivio en tu pecho y un sentimiento profundo e inequívoco de desahogo.</p>

                <p>Elegimos a nuestro crucificado, le ponemos todos los catálogos de los pecados, los examinamos y luego decimos: "¿Tú te acusarías a ti por todo lo que ha hecho?"</p>

                <p>Debes dedicar el resto del tiempo a experimentar que te escapas de todas las pesadas cadenas con las que quisiste encadenar a tu hermano, pero que, de hecho, te encadenaban a ti.</p>

                <Alert className="mt-8">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-4 mt-2">
                      <p className="italic">
                        "Este es un ladrón, me está engañando con el dinero. Me está mintiendo para sacarme dinero. Me está mostrando una cara y luego otra."
                      </p>

                      <p>
                        Una vez aplicado el perdón, comenzamos a contemplar si nuestro "ladrón" tenía una necesidad económica, si no tuvo más opción y se aprovechó de la situación, como tú también lo habrías hecho. No puedes culpabilizarlo.
                      </p>

                      <p>
                        Lo que yo estoy viendo en mi hermano, antes lo he proyectado. Y si lo he proyectado, es porque estaba en mi mente. Entonces, esa culpa que proyecto en mi hermano, yo la he vivido y la he sentido. Pero cuando la traigo dentro de mi mente y veo el agravio junto con la necesidad, me doy cuenta de que es perdonable. Y si es perdonable en mí, es perdonable en el otro. De esta manera, quedan perdonados los dos.
                      </p>

                      <p>
                        Tú has visto esa culpa y el condicionante que te forzó a hacerlo.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
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