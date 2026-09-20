export type ReadingStatus = "reading" | "done" | "queued";

export type ReadingItem = {
  id: string;
  title: string;
  author?: string;
  /** Grouping key, e.g. "August 2026". Items without one fall under "Undated". */
  month?: string;
  status: ReadingStatus;
  /** External link, if the thing is online. */
  href?: string;
  note?: string;
};

export const reading: readonly ReadingItem[] = [
  {
    id: "toy-models",
    title: "Toy Models of Superposition",
    author: "Elhage et al.",
    month: "August 2026",
    status: "done",
    href: "https://transformer-circuits.pub/2022/toy_model/index.html",
    note: "The paper that makes superposition concrete enough to argue with.",
  },
  {
    id: "scaling-monosemanticity",
    title: "Scaling Monosemanticity",
    author: "Templeton et al.",
    month: "August 2026",
    status: "reading",
    href: "https://transformer-circuits.pub/2024/scaling-monosemanticity/",
  },
  {
    id: "a-book",
    title: "A book with no link",
    author: "Some Author",
    month: "July 2026",
    status: "queued",
    note: "Why it is in the queue.",
  },
];

export const READING_STATUS_MARK: Record<ReadingStatus, string> = {
  done: "✓",
  reading: "→",
  queued: "·",
};

/** Groups items by month, preserving the order months first appear. */
export function readingByMonth(
  items: readonly ReadingItem[] = reading,
): { month: string; items: ReadingItem[] }[] {
  const groups = new Map<string, ReadingItem[]>();
  for (const item of items) {
    const key = item.month ?? "Undated";
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }
  return [...groups].map(([month, items]) => ({ month, items }));
}
