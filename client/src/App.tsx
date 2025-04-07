// Modifica estas importaciones para que coincidan con tu estructura de proyecto
// En lugar de usar "@/components/theme-provider", usa la ruta relativa correcta
import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { LessonRoutes } from "./LessonRoutes";
// Ajusta o elimina estas importaciones si no existen en tu proyecto
// import { ThemeProvider } from "./components/theme-provider";
// import { UserProvider } from "./context/user-context";

// Importa los componentes de las lecciones con rutas relativas
import Lesson5 from "./pages/lesson5";
import Lesson20 from "./pages/lesson20";
import Lesson21 from "./pages/lesson21";
import Lesson34 from "./pages/lesson34";

// Lazy loading de componentes - ajusta las rutas
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Exercise = lazy(() => import("./pages/Exercise"));
const Exercise2 = lazy(() => import("./pages/Exercise2"));
const Exercise3 = lazy(() => import("./pages/Exercise3"));
const Exercise4 = lazy(() => import("./pages/Exercise4"));
const Exercise5 = lazy(() => import("./pages/Exercise5"));

const queryClient = new QueryClient();

function App() {
  return (
    // Ajusta o elimina ThemeProvider si no existe en tu proyecto
    // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        {/* Ajusta o elimina UserProvider si no existe en tu proyecto */}
        {/* <UserProvider> */}
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
              
              {/* Nuevas rutas para las lecciones */}
              <Route path="/lesson5" component={Lesson5} />
              <Route path="/lesson20" component={Lesson20} />
              <Route path="/lesson21" component={Lesson21} />
              <Route path="/lesson34" component={Lesson34} />
              
              <Route>404, Not Found!</Route>
            </Switch>
            <LessonRoutes />
          </Suspense>
          <Toaster />
        {/* </UserProvider> */}
      </QueryClientProvider>
    // </ThemeProvider>
  );
}

export default App;
