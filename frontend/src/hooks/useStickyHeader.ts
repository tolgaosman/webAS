import { useEffect, useRef, useState } from "react";

/**
 * One passive scroll listener, rAF-throttled — the legacy code ran an
 * `offsetTop` loop over every <section> on every single scroll event
 * with no throttling (§Faz 5-7). Behavior is otherwise bit-for-bit
 * identical: `scrolled` past 50px, `navHidden` when scrolling down.
 */
export function useStickyHeader(): { scrolled: boolean; navHidden: boolean } {
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      if (y > 50) {
        setScrolled(true);
        setNavHidden(y > lastScrollY.current);
      } else {
        setScrolled(false);
        setNavHidden(false);
      }
      lastScrollY.current = y;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrolled, navHidden };
}
