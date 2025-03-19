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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/exercise" component={Exercise} />
      <Route path="/exercise2" component={Exercise2} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;