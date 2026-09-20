import { EntryList, type Entry } from "@/components/EntryList";
import { postsByDate } from "@/content/posts";

export function Blog() {
  const entries: Entry[] = postsByDate.map((p) => ({
    title: p.title,
    href: `/blog/${p.slug}`,
    meta: p.date,
    metaOnNewLine: true,
    note: p.summary,
  }));

  return (
    <section className="wrap">
      <h1>Blog</h1>
      <EntryList entries={entries} />
    </section>
  );
}
