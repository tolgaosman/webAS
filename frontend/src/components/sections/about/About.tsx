import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { SectionHeader } from "../../common/SectionHeader";
import { Reveal } from "../../common/Reveal";
import { BioCard } from "./BioCard";
import { HobbiesCard } from "./HobbiesCard";
import { CoreSkills } from "./CoreSkills";

export function About() {
  const { content } = usePortfolio();
  const t = useT();

  return (
    <section id="about">
      <div className="container">
        <SectionHeader tag={t(content["section.about.tag"])} title={t(content["section.about.title"])} />

        <Reveal className="about-layout">
          <BioCard />
          <div className="about-sidebar">
            <HobbiesCard />
          </div>
        </Reveal>

        <CoreSkills />
      </div>
    </section>
  );
}
