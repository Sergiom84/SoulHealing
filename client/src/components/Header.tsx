import { ThemeToggle } from "@/components/ThemeToggle";
import ExerciseCalendar from "@/components/ExerciseCalendar";
import InfoSection from "@/components/InfoSection";
import HomeButton from "@/components/HomeButton";
import { useUser } from "@/hooks/useUser";
import UserGreeting from "@/components/UserGreeting";
import { useIsMobile } from "@/hooks/use-mobile";

type HeaderProps = {
  showHome?: boolean;
  showCalendar?: boolean;
  showInfo?: boolean;
};

export default function Header({
  showHome = true,
  showCalendar = true,
  showInfo = false,
}: HeaderProps) {
  const { user } = useUser();
  const isMobile = useIsMobile();

  return (
    <>
      {/* Diseño para móvil */}
      {isMobile ? (
        <div className="w-full px-4 py-2 flex flex-col">
          {/* Primera fila: Home a la izquierda y Theme Toggle a la derecha */}
          <div className="w-full flex justify-between items-center mb-4">
            {showHome && <HomeButton />}
            <ThemeToggle />
          </div>
          
          {/* Segunda fila: Saludo con más espacio */}
          <div className="w-full mb-6 mt-2">
            {showHome && <UserGreeting />}
          </div>
          
          {/* Tercera fila: Calendario e Info */}
          <div className="w-full flex justify-end gap-2 mt-2">
            {showCalendar && <ExerciseCalendar userId={user?.id} />}
            {showInfo && <InfoSection />}
          </div>
        </div>
      ) : (
        // Diseño mejorado para escritorio
        <>
          {/* Casita y saludo con mayor separación */}
          {showHome && (
            <div className="fixed top-4 left-4 z-50 flex flex-col items-start gap-4">
              <HomeButton />
              <div className="mt-8"> {/* Aumentado el margen superior para separar más el saludo del icono */}
                <UserGreeting />
              </div>
            </div>
          )}

          {/* Esquina superior derecha */}
          <header className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
            <ThemeToggle />
            <div className="flex gap-2 mt-2">
              {showCalendar && <ExerciseCalendar userId={user?.id} />}
              {showInfo && <InfoSection />}
            </div>
          </header>
        </>
      )}
    </>
  );
}
