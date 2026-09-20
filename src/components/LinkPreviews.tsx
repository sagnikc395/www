import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lookupPreview, type Preview } from "@/lib/previews";

type PopupState = {
  preview: Preview;
  href: string;
  /** Viewport coordinates; ignored when pinned to the bottom edge. */
  top: number;
  left: number;
  pinned: boolean;
};

const POPUP_WIDTH = 320;
const PINNED_BELOW = 544; // 34rem — matches the dialog breakpoint
const OPEN_DELAY = 120;
const CLOSE_DELAY = 160;

/**
 * Wraps a subtree and gives every `a[data-preview]` inside it a hover popup.
 *
 * Uses event delegation rather than per-link components so it works equally on
 * JSX children and on HTML injected by a markdown build.
 */
export function LinkPreviews({
  children,
  className,
  html,
}: {
  children?: ReactNode;
  className?: string;
  /** Pre-rendered HTML, as an alternative to children. */
  html?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const openTimer = useRef<number>(undefined);
  const closeTimer = useRef<number>(undefined);
  const overPopup = useRef(false);

  const clearTimers = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);

  const close = useCallback(() => {
    clearTimers();
    setPopup(null);
  }, [clearTimers]);

  const openFor = useCallback((anchor: HTMLAnchorElement) => {
    const preview = lookupPreview(anchor.getAttribute("href"));
    if (!preview) return;

    const rect = anchor.getBoundingClientRect();
    const pinned = window.innerWidth < PINNED_BELOW;

    // Prefer below the link; flip above when there is not room for a short popup.
    const below = window.innerHeight - rect.bottom;
    const top = below < 180 && rect.top > 180 ? rect.top - 8 - 180 : rect.bottom + 8;
    const left = Math.min(
      Math.max(8, rect.left),
      Math.max(8, window.innerWidth - POPUP_WIDTH - 8),
    );

    setPopup({ preview, href: anchor.href, top, left, pinned });
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const anchorFrom = (target: EventTarget | null): HTMLAnchorElement | null => {
      const el = target instanceof Element ? target : null;
      return el?.closest<HTMLAnchorElement>("a[data-preview]") ?? null;
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch opens on click instead
      const anchor = anchorFrom(e.target);
      if (!anchor) return;
      clearTimers();
      openTimer.current = window.setTimeout(() => openFor(anchor), OPEN_DELAY);
    };

    const onOut = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!anchorFrom(e.target)) return;
      clearTimers();
      closeTimer.current = window.setTimeout(() => {
        if (!overPopup.current) setPopup(null);
      }, CLOSE_DELAY);
    };

    const onClick = (e: MouseEvent) => {
      const anchor = anchorFrom(e.target);
      if (!anchor) return;
      // On a coarse pointer the first tap previews; the popup carries the link.
      if (window.matchMedia("(hover: none)").matches) {
        e.preventDefault();
        openFor(anchor);
      }
    };

    const onFocusIn = (e: FocusEvent) => {
      const anchor = anchorFrom(e.target);
      if (anchor) openFor(anchor);
    };

    host.addEventListener("pointerover", onOver);
    host.addEventListener("pointerout", onOut);
    host.addEventListener("click", onClick);
    host.addEventListener("focusin", onFocusIn);
    return () => {
      host.removeEventListener("pointerover", onOver);
      host.removeEventListener("pointerout", onOut);
      host.removeEventListener("click", onClick);
      host.removeEventListener("focusin", onFocusIn);
      clearTimers();
    };
  }, [clearTimers, openFor]);

  // A floating popup positioned in viewport coordinates goes stale on scroll
  // or resize, so close rather than chase it.
  useEffect(() => {
    if (!popup || popup.pinned) return;
    const onMove = () => close();
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove);
      window.removeEventListener("resize", onMove);
    };
  }, [popup, close]);

  useEffect(() => {
    if (!popup) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [popup, close]);

  const host = (
    <div
      ref={hostRef}
      className={className}
      {...(html !== undefined ? { dangerouslySetInnerHTML: { __html: html } } : {})}
    >
      {html === undefined ? children : null}
    </div>
  );

  return (
    <>
      {host}
      {popup &&
        createPortal(
          <div
            className={`link-popup${popup.pinned ? " link-popup--pinned" : ""}`}
            style={
              popup.pinned
                ? undefined
                : { top: popup.top, left: popup.left, width: POPUP_WIDTH, maxWidth: "calc(100vw - 1rem)" }
            }
            role="tooltip"
            onPointerEnter={() => {
              overPopup.current = true;
              clearTimers();
            }}
            onPointerLeave={() => {
              overPopup.current = false;
              close();
            }}
          >
            <span className="link-popup-title">{popup.preview.title}</span>
            {popup.preview.meta && <p className="link-popup-meta small muted">{popup.preview.meta}</p>}
            {popup.preview.body && <p className="link-popup-body">{popup.preview.body}</p>}
            <p className="link-popup-url small faint">
              <a href={popup.href} rel="external">
                {popup.href}
              </a>
            </p>
            {popup.pinned && (
              <button type="button" className="link-popup-close" onClick={close}>
                Close
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

/** Convenience anchor that opts a link into the popup. */
export function PreviewLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} rel="external" data-preview="">
      {children}
    </a>
  );
}
