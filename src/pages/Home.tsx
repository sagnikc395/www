import { Link } from "react-router";
import { EntryList, type Entry } from "@/components/EntryList";
import { postsByDate } from "@/content/posts";
import { projects } from "@/content/projects";
import { site } from "@/site.config";

export function Home() {
  const recentPosts: Entry[] = postsByDate.slice(0, 5).map((p) => ({
    title: p.title,
    href: `/blog/${p.slug}`,
    meta: p.date,
    metaOnNewLine: true,
  }));

  const recentProjects: Entry[] = projects.slice(0, 4).map((p) => ({
    title: p.title,
    href: `/projects#${p.slug}`,
    meta: p.year,
    note: p.note,
  }));

  return (
    <section className="wrap">
      <div className="intro">
        {/* Floats right at >=34rem, stacks above the text on mobile. */}
        <img
          className="intro-photo"
          src="/assets/portrait.svg"
          alt={site.name}
          width={130}
          height={173}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <p>
          Your program or role
          <br />
          Your department
          <br />
          Your institution
        </p>
        <p>
          Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>

      <h2>Research interests</h2>
      <p>
        One dense paragraph. No bullet points here — prose signals that you can hold
        an argument together. Name the specific things you work on and what they
        imply, not the fields they belong to.
      </p>

      <h2>Writing</h2>
      <EntryList entries={recentPosts} />
      <p>
        <Link to="/blog">All posts</Link>
      </p>

      <h2>Projects</h2>
      <EntryList entries={recentProjects} />
      <p>
        <Link to="/projects">All projects</Link>
      </p>
    </section>
  );
}
