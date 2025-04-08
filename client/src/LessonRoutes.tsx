import { Route } from "wouter";
import Lesson5 from "./pages/Lesson5";
import Lesson20 from "./pages/Lesson20";
import Lesson21 from "./pages/Lesson21";
import Lesson34 from "./pages/Lesson34";

export function LessonRoutes() {
  return (
    <>
      <Route path="/Lesson5" component={Lesson5} />
      <Route path="/Lesson20" component={Lesson20} />
      <Route path="/Lesson21" component={Lesson21} />
      <Route path="/Lesson34" component={Lesson34} />
    </>
  );
}
