import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "Tú lo ves en tu hermano porque tú lo hiciste antes.",
  "Quiero ver ésta situación de otra forma.",
  "Desconozco si ésta situación es buena o mala, pero seguro que me trae un milagro.",
  "Muéstrame la ilusión tal y cómo es.",
  "Quiero verlo de otra manera.",
  "¿Qué es el perdón sino estar dispuesto a que la verdad sea verdad?",
  "Nada real puede ser amenazado.",
  "Nada irreal existe.",
  "Los pensamientos se expanden cuando se comparten."
];

export default function InspiringQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000); // Cambiar cada 8 segundos

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-24 relative flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
          className="text-lg text-muted-foreground text-center italic max-w-md mx-auto px-4"
        >
          {quotes[currentQuote]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}