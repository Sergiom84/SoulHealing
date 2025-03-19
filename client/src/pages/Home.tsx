import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-light">
              Un Curso de Milagros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Primer método</p>
            </div>

            <div className="text-center">
              <Link href="/exercise">
                <Button className="w-full" size="lg">
                  Comenzar Ejercicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Segundo método</p>
            </div>

            <div className="text-center">
              <Link href="/exercise2">
                <Button className="w-full" size="lg">
                  Comenzar Ejercicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Tercer método</p>
            </div>

            <div className="text-center">
              <Link href="/exercise3">
                <Button className="w-full" size="lg">
                  Comenzar Ejercicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}