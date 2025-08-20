import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BackupControls from './BackupControls';

export default function NotificationSettings() {
  // Reemplazado: Ajustes locales con Backup (sin Supabase)
  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Ajustes</CardTitle>
          <CardDescription>Modo local: los datos se guardan en este dispositivo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Puedes exportar una copia de seguridad o importar un backup existente.</p>
          <BackupControls />
        </CardContent>
      </Card>
    </div>
  );
}
