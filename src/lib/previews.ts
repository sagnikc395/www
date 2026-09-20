/**
 * Metadata shown in the hover popup for annotated links.
 *
 * Keyed by exact href. Anything not in here renders no popup, so a link only
 * gets the dotted underline when there is actually something to preview.
 */
export type Preview = {
  title: string;
  /** Muted line under the title: authors, venue, year. */
  meta?: string;
  /** A sentence or two. Scrolls inside the popup if long. */
  body?: string;
};

export const previews: Record<string, Preview> = {
  "https://transformer-circuits.pub/2022/toy_model/index.html": {
    title: "Toy Models of Superposition",
    meta: "Elhage et al., 2022 · Transformer Circuits",
    body:
      "Shows that models represent more features than they have dimensions by " +
      "packing them into near-orthogonal directions, and that this packing is " +
      "what makes individual neurons polysemantic.",
  },
  "https://transformer-circuits.pub/2024/scaling-monosemanticity/": {
    title: "Scaling Monosemanticity",
    meta: "Templeton et al., 2024 · Transformer Circuits",
    body: "Sparse autoencoders extract interpretable features from a production model.",
  },
};

export function lookupPreview(href: string | null | undefined): Preview | undefined {
  if (!href) return undefined;
  return previews[href];
}
