import "./index.css";
import { Router, Route, Switch } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { LessonRoutes } from "./LessonRoutes";
import { usePushNotifications } from "./usePushNotifications";
import { App as CapacitorApp } from "@capacitor/app";
import { useLocation } from "wouter";

// Lazy loading de componentes
const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login")); // Comentado - usando sistema simplificado
// const Register = lazy(() => import("./pages/Register")); // Comentado - usando sistema simplificado

// Nueva importación para entrada de nombre
import NameEntry from "./components/NameEntry";

// ❗Importación directa para evitar posibles fallos en Android
import Exercise from "./pages/Exercise";

const Exercise2 = lazy(() => import("./pages/Exercise2"));
const Exercise3 = lazy(() => import("./pages/Exercise3"));
const Exercise4 = lazy(() => import("./pages/Exercise4"));
const Exercise5 = lazy(() => import("./pages/Exercise5"));

const queryClient = new QueryClient();

function AppRoutes() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      if (location !== "/") {
        setLocation("/");
        return false;
      }
      return true;
    };

    CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [location, setLocation]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={NameEntry} />
        <Route path="/exercise1" component={Exercise} />
        <Route path="/exercise2" component={Exercise2} />
        <Route path="/exercise3" component={Exercise3} />
        <Route path="/exercise4" component={Exercise4} />
        <Route path="/exercise5" component={Exercise5} />
        <LessonRoutes />
        <Route>404, Not Found!</Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  usePushNotifications();

  console.log("⚡️ App.tsx está renderizando");

  return (
    <QueryClientProvider client={queryClient}>
      <Router base="/">
        <AppRoutes />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
