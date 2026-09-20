/** Everything you edit to make this site yours lives here. */
export const site = {
  name: "Your Name",
  email: "you@example.com",
  description: "CS grad student. Replace this with your own one-liner.",
  lastUpdated: "September 2026",
  nav: [
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Reading", href: "/reading-list" },
    { label: "Resume", href: "/resume.pdf", external: true },
  ],
  social: [
    { label: "GitHub", href: "https://github.com/you" },
    { label: "LinkedIn", href: "https://linkedin.com/in/you" },
    { label: "Google Scholar", href: "https://scholar.google.com/" },
  ],
} as const;
