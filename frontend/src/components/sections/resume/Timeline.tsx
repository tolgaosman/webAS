import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { TimelineItem } from "./TimelineItem";

export function EducationTimeline() {
  const { education } = usePortfolio();
  const t = useT();

  return (
    <div className="timeline" id="education-timeline">
      {education.map((e) => (
        <TimelineItem key={e.id} date={t(e.date)} name={t(e.degree)} org={e.school}>
          <p>{t(e.desc)}</p>
        </TimelineItem>
      ))}
    </div>
  );
}

export function ExperienceTimeline() {
  const { experience } = usePortfolio();
  const t = useT();

  return (
    <div className="timeline" id="experience-timeline">
      {experience.map((exp) => (
        <TimelineItem key={exp.id} date={t(exp.date)} name={t(exp.role)} org={exp.company}>
          <ul>
            {exp.accomplishments.map((a, i) => (
              <li key={i}>{t(a)}</li>
            ))}
          </ul>
        </TimelineItem>
      ))}
    </div>
  );
}
