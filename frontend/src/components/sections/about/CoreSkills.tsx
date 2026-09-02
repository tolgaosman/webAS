import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { Reveal } from "../../common/Reveal";

export function CoreSkills() {
  const { coreSkills, content } = usePortfolio();
  const t = useT();

  return (
    <Reveal className="skills-intro-group">
      <h3>{t(content["about.skillsHeading"])}</h3>
      <div className="skills-grid">
        {coreSkills.map((skill, index) => {
          // Matches the legacy renderer's class formula exactly
          // (see the pre-rewrite src/main.ts, applyDynamicData()).
          const cardClass = index === 0 ? "skill-sticky" : `skill-sticky skill-sticky-${(index % 5) + 1}`;
          return (
            <div key={skill.id} className={cardClass}>
              <div className="skill-sticky-content">
                <h4>{t(skill.title)}</h4>
                <p>{t(skill.desc)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
