/**
 * Three-state theme: "system" follows prefers-color-scheme, "light"/"dark"
 * pin an explicit choice via a data-theme attribute on <html>.
 *
 * The no-flash script in index.html reads the same localStorage key before
 * first paint. Keep the key and the attribute values in sync with it.
 */
import { useCallback, useEffect, useState } from "react";

export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "theme";

export const THEME_LABEL: Record<Theme, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

/** Icon reflects the palette actually in effect, not the chosen mode. */
export function themeIcon(theme: Theme): string {
  if (theme === "dark") return "🌙";
  if (theme === "light") return "☀️";
  return prefersDark() ? "🌙" : "☀️";
}

function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

function readStored(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function commit(theme: Theme): void {
  const root = document.documentElement;
  try {
    if (theme === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem(STORAGE_KEY);
    } else {
      root.setAttribute("data-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {
    // Private mode: the attribute still applies for this session.
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readStored);

  const setTheme = useCallback((next: Theme) => {
    commit(next);
    setThemeState(next);
  }, []);

  // In "system" mode the icon has to re-render when the OS palette flips.
  const [, force] = useState(0);
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => force((n) => n + 1);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return { theme, setTheme };
}
