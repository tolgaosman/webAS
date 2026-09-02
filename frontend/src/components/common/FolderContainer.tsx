import type { CSSProperties, ReactNode } from "react";

interface FolderContainerProps {
  tabLabel: string;
  tabStyle?: CSSProperties;
  className?: string;
  children: ReactNode;
}

/** `.folder-container` + `.folder-tab` — reused across hero, about, resume, and certificate cards. */
export function FolderContainer({ tabLabel, tabStyle, className = "", children }: FolderContainerProps) {
  return (
    <div className={`folder-container${className ? " " + className : ""}`}>
      <span className="folder-tab" style={tabStyle}>
        {tabLabel}
      </span>
      {children}
    </div>
  );
}
