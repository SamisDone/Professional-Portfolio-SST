export type Theme = "light" | "dark";
const KEY = "ss-theme";

/** The explicit choice, if one was ever made. Null means follow the system. */
export function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Espresso unless the visitor has chosen otherwise. Not derived from
 * prefers-color-scheme: the palette is the brand here, and most systems report
 * light, which would leave most visitors never seeing it.
 */
export function defaultTheme(): Theme {
  return "dark";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage blocked; the choice just will not survive a reload */
  }
}
