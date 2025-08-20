import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useBackup } from '@/hooks/useLocalData';

export default function BackupControls() {
  const { busy, doExport, doImport } = useBackup();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onChoose = () => fileRef.current?.click();
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await doImport(text);
    alert('Importación completada');
  };

  return (
    <div className="flex gap-2 items-center">
      <Button disabled={busy} onClick={doExport}>Exportar datos</Button>
      <Button variant="secondary" disabled={busy} onClick={onChoose}>Importar datos</Button>
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onFile} />
    </div>
  );
}