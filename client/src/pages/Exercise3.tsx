import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioPlayer from "@/components/AudioPlayer";
import NameList from "@/components/NameList";
import NoteSection from "@/components/NoteSection";

export default function Exercise3() {
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
        <source src="/audio/leccion78.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-2xl font-light text-center mb-6">
            Lección 78. Que los milagros reemplacen todos mis resentimientos.
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
                <p>Hoy intentaremos ver al Hijo de Dios. No nos haremos los ciegos para no verlo. No vamos a contemplar nuestros resentimientos. Así es como se invierte la manera de ver del mundo: dirigiendo nuestra mirada hacia la verdad y apartándola del miedo.</p>

                <p>Seleccionaremos a alguien que haya sido objeto de tus resentimientos y, dejando estos a un lado, lo miramos.</p>

                <p>Hemos elegido a una persona con la que tenemos resentimientos. Lo colocamos delante de nosotros, apartamos los resentimientos a un lado y lo contemplamos. Quizá es alguien a quien temes o incluso odias, o alguien a quien crees amar pero que te hizo enfadar alguna vez. Alguien a quien llamas amigo, pero que en ocasiones te resulta pesado o difícil de complacer. Alguien exigente e irritante, o que no se ajusta al ideal que debería aceptar como suyo de acuerdo con el papel que tú mismo le has asignado.</p>

                <p>Ya sabes de quién se trata; su nombre ya ha cruzado tu mente. En él es en quien pedimos que se te muestre el Hijo de Dios. Al contemplarlo sin resentimientos, sin los mismos que tú has abrigado en su contra, descubrirás que lo que permanecía oculto cuando no lo veías se encuentra en todo el mundo y se puede ver.</p>

                <p>El que era un enemigo es más que un amigo cuando está en libertad de asumir el santo papel que el Espíritu Santo le ha asignado. Deja que él sea hoy tu salvador. Tal es su función en el plan de Dios, tu Padre. Hoy lo veremos asumiendo este papel.</p>

                <p>Pero primero, intenta mantener su imagen en tu mente tal como lo ves ahora. Pasa revista a sus faltas, a las dificultades que has tenido con él, al dolor que te ha causado, a sus descuidos y a todos los disgustos grandes y pequeños que te ha ocasionado. Contempla las imperfecciones de su cuerpo, así como sus rasgos más atractivos, y piensa en sus errores, incluso en sus pecados.</p>

                <p>Pidámosle entonces a Aquel, con mayúscula, que conoce la realidad y la verdad de este Hijo de Dios, que se nos conceda poder contemplarlo de otra manera y ver a nuestro salvador resplandeciendo en la luz del verdadero perdón que se nos ha concedido.</p>

                <p>En el santo Nombre de Dios y en el de Su Hijo, que es tan santo como Él, le pedimos:</p>

                <p className="pl-4 italic">"Quiero contemplar a mi salvador en este, a quien Tú has designado como aquel al que debo pedir que me guíe hasta la santa luz en la que se encuentra, de modo que pueda unirme a él. Quiero contemplar a mi salvador en este, a quien Tú has elegido como aquel al que debo pedir que me guíe hasta la santa faz en la que se encuentra, de modo que pueda unirme a él."</p>

                <p>Los ojos del cuerpo están cerrados, y mientras piensas en aquel que te agravió, deja que a tu mente se le muestre la luz que brilla en él más allá de tus resentimientos.</p>

                <p>Lo que has pedido no se te puede negar.</p>

                <p>Tu salvador ha estado esperando esto desde hace mucho tiempo. Él quiere ser libre y hacer que su libertad sea también la tuya.</p>

                <p>El Espíritu Santo se extiende desde él hasta ti, y no ves separación alguna en el Hijo de Dios. Lo que ves a través de él os liberará a ambos.</p>

                <p>Lo que has pedido no se te puede negar.</p>

                <p className="pl-4 italic">"Quiero contemplar a mi salvador en este, a quien Tú has elegido como aquel al que debo pedir que me guíe hasta la santa luz en la que se encuentra, de modo que pueda unirme a él."</p>

                <p>Mantente muy quedo ahora y contempla a tu radiante salvador. Ningún sombrío resentimiento nubla la visión que tienes de él. Le has permitido al Espíritu Santo expresar, a través de ese hermano, el papel que Dios le asignó para que tú te pudieses salvar.</p>

                <p>Dios te da las gracias por estos momentos en que dejas a un lado tus imágenes para ver en su lugar el milagro de amor que el Espíritu Santo te muestra.</p>

                <p>Tanto el mundo como el Cielo te dan las gracias, pues ni uno solo de los pensamientos de Dios puede sino regocijarse por tu salvación y por la del mundo entero junto contigo.</p>

                <p>Con ésta simple oración le dices a aquel que está en ti, al Espíritu en ti, quiero contemplar a mi salvador en este a quien tú, con mayúscula, has designado como aquel al que debo pedir que me guíe hasta la Santa Luz en la que se encuentra. El cristo está en él. Y le estás pidiendo que te lleve a la luz en la que está el Cristo en él, de modo que pueda unirme a esa Luz.</p>

                <p>Quiero ver el milagro en vez del resentimiento.</p>
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
                title="Cierra los ojos y escucha."
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