import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Exercise from "@/pages/Exercise";
import Exercise2 from "@/pages/Exercise2";
import Exercise3 from "@/pages/Exercise3";
import Exercise4 from "@/pages/Exercise4";
import Exercise5 from "@/pages/Exercise5";
import Auth from "@/pages/Auth";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Auth} />
      <Route path="/home" component={Home} />
      <Route path="/exercise1" component={Exercise} />
      <Route path="/exercise2" component={Exercise2} />
      <Route path="/exercise3" component={Exercise3} />
      <Route path="/exercise4" component={Exercise4} />
      <Route path="/exercise5" component={Exercise5} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;