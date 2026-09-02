import type { ReactNode } from "react";

interface TimelineItemProps {
  date: string;
  name: string;
  org: string;
  children: ReactNode;
}

export function TimelineItem({ date, name, org, children }: TimelineItemProps) {
  return (
    <div className="timeline-item">
      <div className="timeline-node"></div>
      <div className="timeline-date">{date}</div>
      <h4 className="timeline-name">{name}</h4>
      <div className="timeline-org">{org}</div>
      <div className="timeline-details">{children}</div>
    </div>
  );
}
