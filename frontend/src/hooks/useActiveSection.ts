import { useEffect, useRef, useState } from "react";

/**
 * Tracks which <section id="..."> is "active" for nav-link highlighting.
 * Same rule as the legacy code, preserved exactly: for every section in
 * document order, if scrollY >= section.offsetTop - 150 it's a
 * candidate, and the LAST matching one (i.e. the lowest section that
 * still qualifies) wins. rAF-throttled, unlike the legacy per-scroll-
 * event loop.
 */
export function useActiveSection(): string {
  const [active, setActive] = useState("");
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      let current = "";
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 150) {
          current = section.id;
        }
      });
      setActive(current);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update(); // set initial state on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}
