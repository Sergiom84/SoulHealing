import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioPlayer from "@/components/AudioPlayer";
import NameList from "@/components/NameList";
import NoteSection from "@/components/NoteSection";

export default function Exercise() {
  const [activeTab, setActiveTab] = useState("instrucciones");

  const { data: names, isLoading: namesLoading } = useQuery({
    queryKey: ["/api/names"],
  });

  const { data: notes, isLoading: notesLoading } = useQuery({
    queryKey: ["/api/notes"],
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-2xl font-light text-center mb-6">
            Lección 46: Dios es el Amor en el que perdono
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
                <p>Comienza, como de costumbre, repitiendo la idea de hoy para tus adentros. Cierra los ojos y dedica unos minutos a explorar tu mente en busca de aquellas personas que aún no has perdonado.</p>

                <p>No importa en qué medida, o no, los hayas perdonado. Si estás haciendo bien el ejercicio, debes tener unos cuantos con los que hacer la práctica.</p>

                <p>Menciona a cada una de las personas por su nombre y di:</p>
                <ul className="list-none pl-4">
                  <li>Alberto, Dios es el Amor en el que te perdono.</li>
                  <li>Carlota, Dios es el Amor en el que te perdono.</li>
                  <li>Carmen, Dios es el Amor en el que te perdono.</li>
                </ul>

                <p>Como dice el Curso en otra lección, ni siquiera te lo tienes que creer. Lo puedes decir perfectamente de boca.</p>

                <p>El objetivo del ejercicio es que tú te perdones a ti mismo. Una vez que hayas aplicado la idea a todas las personas que te hayan venido a la mente, di para tus adentros: Dios es el Amor en el que me perdono a mí mismo.</p>

                <p>Después, continúas con tu práctica y empiezas a decir:</p>
                <ul className="list-none pl-4">
                  <li>Dios es el Amor en el que me amo a mí mismo.</li>
                  <li>Dios es el Amor en el que me encuentro a mí mismo.</li>
                  <li>Dios es el Amor en el que me siento bendecido.</li>
                  <li>Dios es el Amor en el que sano mi mente.</li>
                  <li>Dios es el Amor en el que me encuentro con los demás.</li>
                </ul>

                <p>De esta manera, se suaviza la mente. Aquí continúa un tiempo en silencio. Piensa que, en realidad, estás haciendo una oración.</p>

                <p>Recuerda la idea central:</p>
                <ul className="list-none pl-4">
                  <li>No puedo ser culpable porque soy un Hijo de Dios.</li>
                  <li>Ya he sido perdonado.</li>
                  <li>No tengo necesidad de atacar porque el Amor me ha perdonado.</li>
                </ul>

                <p>Y acaba la sesión de práctica diciendo: Dios es el Amor en el que me perdono.</p>
              </div>
            </TabsContent>

            <TabsContent value="nombres">
              <NameList names={names} isLoading={namesLoading} />
            </TabsContent>

            <TabsContent value="audio">
              <AudioPlayer />
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