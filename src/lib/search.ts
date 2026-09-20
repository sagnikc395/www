/**
 * A tiny in-memory search index built from the typed content modules.
 *
 * Deliberately not a library: the corpus is a few hundred short documents, so
 * case-folded substring matching with a small ranking bonus for title hits is
 * both faster to load and easier to reason about than a real index.
 */
import { posts } from "@/content/posts";
import { projects } from "@/content/projects";
import { reading } from "@/content/reading";

export type SearchDoc = {
  id: string;
  title: string;
  url: string;
  /** Muted line under the title: a date, a year, an author. */
  meta?: string;
  /** Searched but only shown as a snippet when it contains the match. */
  body?: string;
  external?: boolean;
};

export type SearchHit = SearchDoc & { snippet?: string };

/** Static pages have no content module, so they are listed by hand. */
const pages: readonly SearchDoc[] = [
  { id: "page:home", title: "Home", url: "/" },
  { id: "page:blog", title: "Blog", url: "/blog" },
  { id: "page:projects", title: "Projects", url: "/projects" },
  { id: "page:reading", title: "Reading list", url: "/reading-list" },
];

export const searchIndex: readonly SearchDoc[] = [
  ...pages,
  ...posts.map((p) => ({
    id: `post:${p.slug}`,
    title: p.title,
    url: `/blog/${p.slug}`,
    meta: p.date,
    body: p.summary,
  })),
  ...projects.map((p) => ({
    id: `project:${p.slug}`,
    title: p.title,
    url: `/projects#${p.slug}`,
    meta: p.year,
    body: p.note,
  })),
  ...reading.map((r) => ({
    id: `reading:${r.id}`,
    title: r.title,
    url: r.href ?? "/reading-list",
    meta: [r.author, r.month].filter(Boolean).join(" · "),
    body: r.note,
    external: Boolean(r.href),
  })),
];

const SNIPPET_RADIUS = 60;

export function search(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored: { hit: SearchHit; score: number }[] = [];

  for (const doc of searchIndex) {
    const title = doc.title.toLowerCase();
    const titleAt = title.indexOf(q);
    const bodyAt = doc.body ? doc.body.toLowerCase().indexOf(q) : -1;
    if (titleAt === -1 && bodyAt === -1) continue;

    // Title beats body; an earlier match beats a later one; shorter titles
    // win ties so "Blog" outranks a post that merely mentions the word.
    let score = 0;
    if (titleAt !== -1) score += 100 - Math.min(titleAt, 50) + (titleAt === 0 ? 25 : 0);
    if (bodyAt !== -1) score += 20 - Math.min(bodyAt, 19) / 20;
    score -= doc.title.length / 200;

    scored.push({
      hit: { ...doc, snippet: bodyAt === -1 ? undefined : snippetAround(doc.body!, bodyAt, q.length) },
      score,
    });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.hit);
}

function snippetAround(body: string, at: number, matchLen: number): string {
  const start = Math.max(0, at - SNIPPET_RADIUS);
  const end = Math.min(body.length, at + matchLen + SNIPPET_RADIUS);
  return (start > 0 ? "…" : "") + body.slice(start, end).trim() + (end < body.length ? "…" : "");
}

/** Splits text into alternating plain/matched runs for <mark> rendering. */
export function splitOnMatch(text: string, query: string): { text: string; match: boolean }[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [{ text, match: false }];

  const parts: { text: string; match: boolean }[] = [];
  const lower = text.toLowerCase();
  let cursor = 0;

  for (;;) {
    const at = lower.indexOf(q, cursor);
    if (at === -1) break;
    if (at > cursor) parts.push({ text: text.slice(cursor, at), match: false });
    parts.push({ text: text.slice(at, at + q.length), match: true });
    cursor = at + q.length;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
  return parts;
}

/** Platform-appropriate label for the shortcut hint. */
export function shortcutLabel(): string {
  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return mac ? "⌘K" : "Ctrl K";
}
