import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Bell } from 'lucide-react';
import NotificationSettings from './NotificationSettings';

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          title="Configurar recordatorios"
        >
          <Bell size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Recordatorios de Práctica</DialogTitle>
          <DialogDescription>
            Programa recordatorios para no olvidar tu rutina espiritual diaria
          </DialogDescription>
        </DialogHeader>
        <NotificationSettings />
      </DialogContent>
    </Dialog>
  );
}