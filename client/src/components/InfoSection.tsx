import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationSettings from '@/components/NotificationSettings';

export default function InfoSection() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Info className="h-4 w-4" />
            <span>Info</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-light"></DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="guia" className="mt-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="guia">Guía de Uso</TabsTrigger>
              <TabsTrigger value="contacto">Contacto</TabsTrigger>
              <TabsTrigger value="agradecimientos">Agradecimientos</TabsTrigger>
              <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guia" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cómo realizar los ejercicios</CardTitle>
                  <CardDescription>
                    
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">1. Frecuencia</h3>
                    <p>Realiza un solo ejercicio por día.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">2. Preparación</h3>
                    <p>Encuentra un lugar tranquilo. Dedica al menos 10 minutos para cada práctica.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">3. Lectura</h3>
                    <p>Lee la introducción del ejercicio con atención. Cada palabra tiene un propósito específico.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">4. Nombres</h3>
                    <p>En la pestaña "Nombres", anota las personas a quienes aplicarás el perdón.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">5. Audio</h3>
                    <p>Escucha el audio guiado para profundizar en la práctica. Puedes ajustar la velocidad y volumen según necesites.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">6. Notas</h3>
                    <p>Después de completar el ejercicio, registra tus reflexiones en la pestaña "Notas".</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">7. Seguimiento</h3>
                    <p>Marca el ejercicio como completado en el calendario para saber que lección has practicado cada día.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">8. Práctica diaria</h3>
                    <p>Intenta aplicar las enseñanzas del ejercicio durante todo el día, no solo durante la sesión formal.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contacto" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contacto</CardTitle>
                  <CardDescription>
                   
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-medium text-primary mb-2">Correo electrónico</h3>
                    <p className="text-sm">sergiohernandezlara07@gmail.com</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Envíame tus sugerencias, comentarios o experiencias con la aplicación.
                                          </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-medium text-primary mb-2"></h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium"></p>
                        <p className="text-muted-foreground"></p>
                      </div>
                      <div>
                        <p className="font-medium"></p>
                        <p className="text-muted-foreground"></p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-center text-muted-foreground mt-4">
                    
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="agradecimientos" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agradecimientos</CardTitle>
                  <CardDescription>
                    
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">José Luis Molina </h3>
                    <p className="text-sm">Por su dedicación en difundir las enseñanzas de Un Curso de Milagros.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium"></h3>
                    <p className="text-sm"></p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium"></h3>
                    <p className="text-sm"></p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">A ti</h3>
                    <p className="text-sm">Por tu compromiso con el perdón.</p>
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                    <p className="italic text-sm">
                      "El perdón es la llave de la felicidad."
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      — Un Curso de Milagros
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notificaciones" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Notificaciones</CardTitle>
                  <CardDescription>
                    Personaliza los recordatorios para tus ejercicios diarios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
