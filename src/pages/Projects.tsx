import { EntryList, type Entry } from "@/components/EntryList";
import { projects } from "@/content/projects";

export function Projects() {
  const entries: Entry[] = projects.map((p) => ({
    title: p.title,
    href: `#${p.slug}`,
    meta: p.year,
    note: p.note,
  }));

  return (
    <section className="wrap">
      <h1>Projects</h1>
      <EntryList entries={entries} />
    </section>
  );
}
