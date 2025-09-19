import { useEffect } from "react";
import { useLocation } from "wouter";
// import { useUser } from "@/hooks/useUser"; // Comentado - usando sistema simplificado
import { useSimpleUser } from "@/hooks/useSimpleUser";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useSimpleUser();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Mientras carga la sesión, puedes mostrar un "loading..."
  if (loading) {
    return <div className="p-4 text-center">Cargando...</div>;
  }

  // Si hay usuario, renderiza el contenido
  if (user) {
    return <>{children}</>;
  }

  // Si no hay usuario, no muestra nada mientras redirige
  return null;
}
