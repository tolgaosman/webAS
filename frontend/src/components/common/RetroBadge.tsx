import type { ReactNode } from "react";

export function RetroBadge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`retro-badge${className ? " " + className : ""}`}>{children}</span>;
}
