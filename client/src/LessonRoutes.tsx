import { Route } from "wouter";
import Lesson5 from "./pages/lesson5";
import Lesson20 from "./pages/lesson20";
import Lesson21 from "./pages/lesson21";
import Lesson34 from "./pages/lesson34";

export function LessonRoutes() {
  return (
    <>
      <Route path="/lesson5" component={Lesson5} />
      <Route path="/lesson20" component={Lesson20} />
      <Route path="/lesson21" component={Lesson21} />
      <Route path="/lesson34" component={Lesson34} />
    </>
  );
}
