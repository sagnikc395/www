import { useEffect, useRef, useState } from "react";
import { THEMES, THEME_LABEL, themeIcon, useTheme } from "@/lib/theme";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <span className="theme-picker" ref={ref}>
      <button
        type="button"
        className="theme-toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${theme}`}
        title={`Theme: ${theme}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">{themeIcon(theme)}</span>
      </button>
      {open && (
        <div className="theme-menu" role="menu">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              role="menuitemradio"
              aria-checked={theme === t}
              onClick={() => {
                setTheme(t);
                setOpen(false);
              }}
            >
              {THEME_LABEL[t]}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
