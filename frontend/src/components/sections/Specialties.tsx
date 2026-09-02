import { usePortfolio } from "../../hooks/usePortfolio";
import { useT } from "../../i18n/useTranslation";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../common/Reveal";
import { SpecialtyPanel } from "./SpecialtyPanel";

export function Specialties() {
  const { specialties, content } = usePortfolio();
  const t = useT();

  return (
    <section id="specialties">
      <div className="container">
        <SectionHeader tag={t(content["section.specialties.tag"])} title={t(content["section.specialties.title"])} />

        <Reveal className="specialties-grid">
          {specialties.map((s) => (
            <SpecialtyPanel key={s.id} specialty={s} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
