import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import InspiringQuotes from "@/components/InspiringQuotes";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/exercise">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/background.png" 
                  alt="Espiral de luz" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Primer método</h2>
              <p className="text-muted-foreground">Dios es el Amor en el que perdono.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/exercise2">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/background2.png" 
                  alt="Flor de luz" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Segundo método</h2>
              <p className="text-muted-foreground">El amor no abriga resentimientos.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/exercise3">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/background3.png" 
                  alt="Espiral cósmica" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Tercer método</h2>
              <p className="text-muted-foreground">Que los milagros reemplacen todos mis resentimientos.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/exercise4">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/background4.png" 
                  alt="Corazón de luz" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  style={{ objectPosition: 'center' }}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Cuarto método</h2>
              <p className="text-muted-foreground">El perdón es la llave de la felicidad.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/exercise5" className="sm:col-span-2">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img 
                  src="/images/background5.png" 
                  alt="Portal de luz" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  style={{ objectPosition: 'center' }}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Quinto método</h2>
              <p className="text-muted-foreground">Quiero percibir el perdón tal como es.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  return showWelcome ? (
    <WelcomeScreen onContinue={() => setShowWelcome(false)} />
  ) : (
    <MainAppContent />
  );
}