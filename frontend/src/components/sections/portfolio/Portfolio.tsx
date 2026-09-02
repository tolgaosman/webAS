import { useState } from "react";
import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { SectionHeader } from "../../common/SectionHeader";
import { Reveal } from "../../common/Reveal";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioModal } from "./PortfolioModal";
import type { Project } from "../../../types/portfolio";

export function Portfolio() {
  const { projects, content } = usePortfolio();
  const t = useT();
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="portfolio">
      <div className="container">
        <SectionHeader tag={t(content["section.portfolio.tag"])} title={t(content["section.portfolio.title"])} />

        <Reveal className="portfolio-grid">
          {projects.map((p) => (
            <PortfolioCard key={p.id} project={p} onOpen={() => setActive(p)} />
          ))}
        </Reveal>
      </div>

      {active && <PortfolioModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}
