import { useEffect, type RefObject } from "react";

/**
 * One shared IntersectionObserver instance (module-scoped), matching
 * the legacy threshold/rootMargin exactly. Each <Reveal> component
 * calls this on mount to register its own element — critical detail
 * (§Faz 5-7 "risks and traps"): the legacy code queried `.reveal` once
 * at DOMContentLoaded, which worked only because those wrapper elements
 * were static and already in the DOM before app.js ran. In React,
 * sections mount as data loads, so per-element registration on mount
 * is required or late-mounting sections would stay at opacity:0
 * forever.
 */
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
  }
  return sharedObserver;
}

export function useScrollReveal<T extends HTMLElement>(ref: RefObject<T>, active: boolean): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || active) return; // hero renders with .reveal.active from the start, no observer needed

    const observer = getObserver();
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [ref, active]);
}
