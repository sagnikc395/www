import { useEffect, useState } from "react";
import { SearchDialog } from "@/components/SearchDialog";
import { shortcutLabel } from "@/lib/search";

/** The ⌘K affordance in the nav, plus the global shortcut that opens it. */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("⌘K");

  // navigator.platform is read after mount so the markup stays deterministic.
  useEffect(() => setLabel(shortcutLabel()), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <span className="search-picker">
      <button
        type="button"
        className="search-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Search this site"
        onClick={() => setOpen(true)}
      >
        <span className="search-kbd">{label}</span>
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </span>
  );
}
