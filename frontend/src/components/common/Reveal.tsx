import { useRef, type ReactNode, type CSSProperties } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface RevealProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Renders pre-activated with no observer (only the hero uses this — see index.html's `.hero-visual.reveal.active`). */
  active?: boolean;
  style?: CSSProperties;
}

export function Reveal({ children, className = "", id, active = false, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null!);
  useScrollReveal(ref, active);

  return (
    <div ref={ref} id={id} className={`reveal${active ? " active" : ""}${className ? " " + className : ""}`} style={style}>
      {children}
    </div>
  );
}
