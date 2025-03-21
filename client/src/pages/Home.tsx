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
    <div 
      className="min-h-screen p-6 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/images/background.png")',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay'
      }}
    >
      <motion.h1
        className="text-4xl font-serif mb-4 text-white"
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
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold mb-2 text-white">Primer método</h2>
              <p className="text-gray-200">Dios es el Amor en el que perdono.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/exercise2">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold mb-2 text-white">Segundo método</h2>
              <p className="text-gray-200">El amor no abriga resentimientos.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/exercise3">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold mb-2 text-white">Tercer método</h2>
              <p className="text-gray-200">Que los milagros reemplacen todos mis resentimientos.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/exercise4">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold mb-2 text-white">Cuarto método</h2>
              <p className="text-gray-200">El perdón es la llave de la felicidad.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/exercise5" className="sm:col-span-2">
          <Card className="rounded-2xl shadow-md border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/10">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold mb-2 text-white">Quinto método</h2>
              <p className="text-gray-200">Quiero percibir el perdón tal como es.</p>
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