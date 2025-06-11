import { ThemeToggle } from "@/components/ThemeToggle";
import ExerciseCalendar from "@/components/ExerciseCalendar";
import InfoSection from "@/components/InfoSection";
import HomeButton from "@/components/HomeButton";
import { useUser } from "@/hooks/useUser";
import UserGreeting from "@/components/UserGreeting";
import { useIsMobile } from "@/hooks/use-mobile";
import AuthIndicator from './AuthIndicator';

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
        <header className="w-full sticky top-0 px-4 pt-8 pb-2 flex flex-col bg-background z-50">
          {/* Primera fila: Home a la izquierda y Theme Toggle + Auth a la derecha */}
          <div className="w-full flex justify-between items-center mb-4 px-2">
            <div className="flex-shrink-0">
              {showHome && <HomeButton />}
            </div>
            <div className="flex-shrink-0 ml-auto flex items-center gap-3">
              <ThemeToggle />
              <AuthIndicator />
            </div>
          </div>

          {/* Segunda fila: Saludo */}
          <div className="w-full mb-6 mt-2">
            {showHome && <UserGreeting />}
          </div>

          {/* Tercera fila: Calendario e Info */}
          <div className="w-full flex justify-end gap-2 mt-2">
            {showCalendar && <ExerciseCalendar userId={user?.id} />}
            {showInfo && <InfoSection />}
          </div>
        </header>
      ) : (
        // Diseño escritorio
        <>
          {/* Casita y saludo */}
          {showHome && (
            <div className="fixed top-4 left-4 z-50 flex flex-col items-start gap-4">
              <HomeButton />
              <div className="mt-8">
                <UserGreeting />
              </div>
            </div>
          )}

          {/* Esquina superior derecha */}
          <header className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
            <ThemeToggle />
            <AuthIndicator />
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
