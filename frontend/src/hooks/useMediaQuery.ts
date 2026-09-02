import { useEffect, useState } from "react";

/**
 * Powers the declarative version of the legacy responsive language-
 * selector relocation (§Faz 5-7): instead of `appendChild`-ing the live
 * DOM node between `.nav-actions` and a synthesized `#mobile-lang-wrapper`
 * `<li>`, Header renders the same <LangSelector>/<ThemeToggle> components
 * in one of two places based on this hook's boolean.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const listener = () => setMatches(mql.matches);
    listener();
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
