import "./index.css";
import { Router, Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { LessonRoutes } from "./LessonRoutes";
import { usePushNotifications } from "./usePushNotifications";

// Lazy loading de componentes
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// ❗Importación directa para evitar posibles fallos en Android
import Exercise from "./pages/Exercise";

const Exercise2 = lazy(() => import("./pages/Exercise2"));
const Exercise3 = lazy(() => import("./pages/Exercise3"));
const Exercise4 = lazy(() => import("./pages/Exercise4"));
const Exercise5 = lazy(() => import("./pages/Exercise5"));

const queryClient = new QueryClient();

function App() {
  usePushNotifications();

  console.log("⚡️ App.tsx está renderizando"); // 🐞 Log para verificar el montaje del componente

  return (
    <QueryClientProvider client={queryClient}>
      <Router base="/">
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/exercise1" component={Exercise} />
            <Route path="/exercise2" component={Exercise2} />
            <Route path="/exercise3" component={Exercise3} />
            <Route path="/exercise4" component={Exercise4} />
            <Route path="/exercise5" component={Exercise5} />

            {/* Las rutas de las lecciones se gestionan dentro de LessonRoutes */}
            <LessonRoutes />

            <Route>404, Not Found!</Route>
          </Switch>
        </Suspense>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
