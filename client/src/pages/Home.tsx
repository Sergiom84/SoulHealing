import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-light flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Un Curso de Milagros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Lección 46</p>
            <p>Dios es el Amor en el que perdono.</p>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Este ejercicio te guiará a través del proceso de perdón, 
              ayudándote a reconocer la verdadera naturaleza del amor divino.
            </p>
            
            <Link href="/exercise">
              <Button className="w-full" size="lg">
                Comenzar Ejercicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
