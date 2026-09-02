import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

/**
 * §Faz 5-7 "risks and traps": styles.css ships a complete
 * [data-theme="dark"] palette and .theme-toggle button styling, but the
 * legacy static HTML never actually rendered a #theme-toggle button, so
 * the listener that read it always found null and dark mode was
 * unreachable. This hook wires it up for real. If a full-site dark-mode
 * QA pass finds it visually broken, hide the button with one CSS rule
 * in src/styles/lang-selector.css rather than deleting this hook — the
 * palette and every component here stay ready for a later fix.
 */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(() => {
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
