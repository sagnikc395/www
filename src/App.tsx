import { Route, Routes } from "react-router";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Blog } from "@/pages/Blog";
import { Post } from "@/pages/Post";
import { Projects } from "@/pages/Projects";
import { ReadingList } from "@/pages/ReadingList";
import { NotFound } from "@/pages/NotFound";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<Post />} />
        <Route path="projects" element={<Projects />} />
        <Route path="reading-list" element={<ReadingList />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
