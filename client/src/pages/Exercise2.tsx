import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioPlayer from "@/components/AudioPlayer";
import NameList from "@/components/NameList";
import NoteSection from "@/components/NoteSection";

export default function Exercise2() {
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

  return (
    <div className="min-h-screen bg-background p-4">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      >
        <source src="/audio/leccion68.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-2xl font-light text-center mb-6">
            Lección 68: El amor no abriga resentimientos
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
                <p>Comienza la sesión de práctica buscando en tu mente a aquellas personas que son objeto de algunos de tus mayores resentimientos. Algunas de ellas serán muy fáciles de identificar.</p>

                <p>Piensa luego en los resentimientos aparentemente insignificantes que abrigas contra aquellas personas a quienes aprecias e incluso piensas que amas. Muy pronto te darás cuenta de que no hay nadie contra quien no abrigues alguna clase de resentimiento. Siempre hay un resentimiento contra todas las personas. Esto te ha dejado solo en medio del universo, tal como te percibes a ti mismo.</p>

                <p>Busca a las personas contra quienes tienes resentimientos, los pones en fila y les dices a cada uno:</p>
                <p className="pl-4 italic">"Te consideraré mi amigo, de manera que pueda recordar que eres parte de mí y así poder llegar a conocerme a mí mismo."</p>

                <p>Resuélvete ahora a ver a todas esas personas como amigos. Haces esa determinación y diles a todas ellas, pensando en cada una por separado: "Te consideraré mi amigo."</p>

                <p>No tienes que ir a pedirles perdón. No tienes que hablar con ellos. No los tienes que ver. No tienes que decirles que les has perdonado.</p>

                <p>Tú haces el trabajo en tu mente, y les veremos cambiar, y esa es la venganza contra el que nos ha hecho daño: verle bueno. Porque vamos a quitar los resentimientos.</p>

                <p>Comienza diciéndolo de boca aunque no te lo creas. Después de repetirse muchas veces, se hace en parte como cierta, pero con muchas reservas. Más tarde se considera seriamente cada vez más y, finalmente, se acepta como verdad.</p>

                <p>Para el resto de la sesión, trata de imaginarte a ti mismo completamente en paz con todo el mundo, a salvo en un mundo que te protege y te ama. Y al que tú amas.</p>

                <p>Siente cómo la seguridad te rodea, te envuelve y te sustenta. Trata de creer, por muy brevemente que sea, que no hay nada que pueda causarte daño alguno.</p>

                <p>Como dice el Curso, sólo en la mente es donde hay que hacer los trabajos.</p>

                <p>Al final de la sesión, repite para tus adentros: "El amor no abriga resentimientos. Cuando me desprenda de ellos, sabré que estoy completamente a salvo."</p>

                <p>Este ejercicio nos acerca por primera vez a la idea de que tenemos cosas pendientes tanto con enemigos como con las personas que supuestamente amamos, mostrándonos la soledad en la que vivimos y el peligro al que estamos expuestos en todo momento. Pues, sin saberlo, hemos abierto incluso con los más próximos la posibilidad de que se conviertan en traidores.</p>

                <p>Cada juicio negativo que sostenemos sin perdonar a alguien posibilita la ingratitud hacia nosotros.</p>
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