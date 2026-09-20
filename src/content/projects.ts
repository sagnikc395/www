export type Project = {
  slug: string;
  title: string;
  year: string;
  note: string;
};

export const projects: readonly Project[] = [
  {
    slug: "project-name",
    title: "Project name — one-clause description",
    year: "2026",
    note:
      "Two sentences on what it actually does and the number that makes it " +
      "interesting. The note is muted so the title still leads.",
  },
  {
    slug: "another-project",
    title: "Another project",
    year: "2025",
    note: "What it is, and the constraint that made it hard.",
  },
];
