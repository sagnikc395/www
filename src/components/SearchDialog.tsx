import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { search, splitOnMatch, type SearchHit } from "@/lib/search";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const labelId = useId();

  const hits = useMemo(() => search(query), [query]);

  // Reset between openings so a stale query never flashes.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Lock background scroll while the overlay is up.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Keep the active row inside the scroll viewport when arrowing past its edge.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(".is-active")?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = useCallback(
    (hit: SearchHit | undefined) => {
      if (!hit) return;
      onClose();
      if (hit.external) window.open(hit.url, "_blank", "noopener,noreferrer");
      else navigate(hit.url);
    },
    [navigate, onClose],
  );

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (hits.length === 0 ? 0 : (i + 1) % hits.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (hits.length === 0 ? 0 : (i - 1 + hits.length) % hits.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(hits[active]);
    }
  };

  return createPortal(
    <div
      className="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-dialog" onKeyDown={onKeyDown}>
        <label id={labelId} className="sr-only" htmlFor={`${labelId}-input`}>
          Search this site
        </label>
        <input
          id={`${labelId}-input`}
          ref={inputRef}
          className="search-input"
          type="search"
          placeholder="Search posts, projects, reading…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-controls={`${labelId}-results`}
          aria-activedescendant={hits[active] ? `${labelId}-hit-${active}` : undefined}
        />

        {hits.length > 0 ? (
          <ul className="search-results" id={`${labelId}-results`} role="listbox" ref={listRef}>
            {hits.map((hit, i) => (
              <li
                key={hit.id}
                id={`${labelId}-hit-${i}`}
                role="option"
                aria-selected={i === active}
                className={`search-hit${i === active ? " is-active" : ""}`}
                onMouseMove={() => setActive(i)}
                onClick={() => go(hit)}
              >
                <span className="search-hit-title">
                  <Highlight text={hit.title} query={query} />
                  {hit.external && <span className="search-hit-external"> ↗</span>}
                </span>
                {hit.meta && <span className="search-hit-meta small muted">{hit.meta}</span>}
                {hit.snippet && (
                  <span className="search-hit-snippet small muted">
                    <Highlight text={hit.snippet} query={query} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="search-empty small muted">
            {query.trim().length < 2 ? "Type to search." : "No matches."}
          </p>
        )}

        <p className="search-hint small faint">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </p>
      </div>
    </div>,
    document.body,
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {splitOnMatch(text, query).map((part, i) =>
        part.match ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>,
      )}
    </>
  );
}
