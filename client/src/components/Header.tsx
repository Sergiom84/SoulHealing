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
      {/* Contenedor principal para móvil */}
      {isMobile ? (
        <div className="w-full px-4 py-2 flex flex-col">
          {/* Primera fila: Home y Theme Toggle */}
          <div className="w-full flex justify-between items-center mb-2">
            {showHome && <HomeButton />}
            <ThemeToggle />
          </div>
          
          {/* Segunda fila: Saludo */}
          <div className="w-full mb-2">
            {showHome && <UserGreeting />}
          </div>
          
          {/* Tercera fila: Calendario e Info */}
          <div className="w-full flex justify-end gap-2">
            {showCalendar && <ExerciseCalendar userId={user?.id} />}
            {showInfo && <InfoSection />}
          </div>
        </div>
      ) : (
        // Diseño original para escritorio
        <>
          {/* Casita y saludo */}
          {showHome && (
            <div className="fixed top-4 left-4 z-50 flex flex-col items-start gap-2">
              <HomeButton />
              <div className="mt-4">
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
