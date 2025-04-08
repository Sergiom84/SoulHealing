// client/src/App.tsx
import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { LessonRoutes } from "./LessonRoutes";

// Importa las lecciones con rutas relativas
import Lesson5 from "./pages/Lesson5";
import Lesson20 from "./pages/Lesson20";
import Lesson21 from "./pages/Lesson21";
import Lesson34 from "./pages/Lesson34";

// Lazy loading de componentes
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register")); // Componente Register integrado
const Exercise = lazy(() => import("./pages/Exercise"));
const Exercise2 = lazy(() => import("./pages/Exercise2"));
const Exercise3 = lazy(() => import("./pages/Exercise3"));
const Exercise4 = lazy(() => import("./pages/Exercise4"));
const Exercise5 = lazy(() => import("./pages/Exercise5"));

const queryClient = new QueryClient();

function App() {
  return (
    // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> (opcional)
      <QueryClientProvider client={queryClient}>
        {/* <UserProvider> (opcional) */}
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} /> {/* Nueva ruta para registro */}
              <Route path="/exercise1" component={Exercise} />
              <Route path="/exercise2" component={Exercise2} />
              <Route path="/exercise3" component={Exercise3} />
              <Route path="/exercise4" component={Exercise4} />
              <Route path="/exercise5" component={Exercise5} />
              
              {/* Nuevas rutas para las lecciones */}
              <Route path="/Lesson5" component={Lesson5} />
              <Route path="/Lesson20" component={Lesson20} />
              <Route path="/Lesson21" component={Lesson21} />
              <Route path="/Lesson34" component={Lesson34} />
              
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
