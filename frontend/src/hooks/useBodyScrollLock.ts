import { useEffect } from "react";

let lockCount = 0;

/**
 * Replaces the legacy `document.body.style.overflow = "hidden"` toggle
 * with a ref-counted version so two overlays opening/closing in
 * sequence (or, in principle, simultaneously) can't leave the body
 * permanently locked.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    lockCount++;
    if (lockCount === 1) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = "";
      }
    };
  }, [locked]);
}
