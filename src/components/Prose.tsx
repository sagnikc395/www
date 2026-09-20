import type { ReactNode } from "react";
import { LinkPreviews } from "@/components/LinkPreviews";

/**
 * Long-form body wrapper. Everything a markdown renderer emits goes inside
 * .md-output, which styles tables, figures, blockquotes and code without
 * per-element classes. Links carrying data-preview get a hover popup.
 */
export function Prose({ children }: { children: ReactNode }) {
  return <LinkPreviews className="md-output">{children}</LinkPreviews>;
}

/** Same, for HTML you already trust (e.g. your own markdown build's output). */
export function ProseHtml({ html }: { html: string }) {
  return <LinkPreviews className="md-output" html={html} />;
}
