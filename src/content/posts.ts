export type Post = {
  slug: string;
  title: string;
  date: string;
  /** ISO date, used for sorting only. */
  published: string;
  summary?: string;
};

export const posts: readonly Post[] = [
  {
    slug: "a-title-that-states-the-finding",
    title: "A title that states the finding, not the topic",
    date: "07 August 2026",
    published: "2026-08-07",
    summary: "One sentence on what the piece actually concludes.",
  },
  {
    slug: "a-question-the-piece-answers",
    title: "Another post, phrased as a question the piece answers",
    date: "10 May 2026",
    published: "2026-05-10",
  },
];

export const postsByDate = [...posts].sort((a, b) =>
  b.published.localeCompare(a.published),
);

export function findPost(slug: string | undefined): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
