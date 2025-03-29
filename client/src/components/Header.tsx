import { ThemeToggle } from "@/components/ThemeToggle";
import ExerciseCalendar from "@/components/ExerciseCalendar";
import InfoSection from "@/components/InfoSection";
import HomeButton from "@/components/HomeButton";
import { useUser } from "@/hooks/useUser";
import UserGreeting from "@/components/UserGreeting";

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

  return (
    <>
      {/* Casita: solo si se permite */}
      {showHome && (
        <div className="fixed top-4 left-4 z-50 flex flex-col items-start gap-2">
          <HomeButton />
          <div className="mt-12"> {/* Aumentado el margen superior para separar más el saludo del icono */}
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
  );
}
