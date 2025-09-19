import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import InspiringQuotes from "@/components/InspiringQuotes";
import UserGreeting from "@/components/UserGreeting";
// import { useUser } from "@/hooks/useUser"; // Comentado - usando sistema simplificado
import { useSimpleUser } from "@/hooks/useSimpleUser";
import Header from "@/components/Header";
import LessonCarousel from "@/components/LessonCarousel";

function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-serif mb-6">Un Curso de Milagros</h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-8">
          "El perdón es la llave de la felicidad."<br />
          <span className="text-sm italic">– Un Curso de Milagros</span>
        </p>
        <Button
          className="px-6 py-3 rounded-2xl shadow hover:bg-primary/90 transition"
          onClick={onContinue}
        >
          Entrar
        </Button>
      </motion.div>
    </div>
  );
}

function MainAppContent() {
  const { user } = useSimpleUser();

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl font-serif mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Un Curso de Milagros
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <InspiringQuotes />
      </motion.div>

      {/* Ejercicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Ejercicio 1 */}
        <Link href="/exercise1">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img src="/images/background.png" alt="Espiral de luz" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Primer ejercicio</h2>
              <p className="text-muted-foreground">Dios es el Amor en el que perdono.</p>
            </CardContent>
          </Card>
        </Link>

        {/* Ejercicio 2 */}
        <Link href="/exercise2">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img src="/images/background2.png" alt="Ejercicio 2" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Segundo ejercicio</h2>
              <p className="text-muted-foreground">El amor no abriga resentimientos.</p>
            </CardContent>
          </Card>
        </Link>

        {/* Ejercicio 3 */}
        <Link href="/exercise3">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img src="/images/background3.png" alt="Ejercicio 3" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Tercer ejercicio</h2>
              <p className="text-muted-foreground">Que los milagros reemplacen todos mis resentimientos.</p>
            </CardContent>
          </Card>
        </Link>

        {/* Ejercicio 4 */}
        <Link href="/exercise4">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img src="/images/background4.png" alt="Ejercicio 4" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Cuarto ejercicio</h2>
              <p className="text-muted-foreground">El perdón es la llave de la felicidad.</p>
            </CardContent>
          </Card>
        </Link>

        {/* Ejercicio 5 */}
        <Link href="/exercise5">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img src="/images/background5.png" alt="Ejercicio 5" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Quinto ejercicio</h2>
              <p className="text-muted-foreground">Quiero percibir el perdón tal como es.</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Carrusel de lecciones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 w-full"
      >
        <LessonCarousel />
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { user, loading } = useSimpleUser();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  if (loading) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Redirigiendo al login...
      </div>
    );
  }

  return showWelcome ? (
    <>
      <Header showHome={false} showCalendar={false} />
      <WelcomeScreen onContinue={() => setShowWelcome(false)} />
    </>
  ) : (
    <>
      <Header showInfo />
      <MainAppContent />
    </>
  );
}
