import type { Project } from "../../../types/portfolio";
import { useDict, useT } from "../../../i18n/useTranslation";
import { assetUrl } from "../../../lib/assetUrl";

export function PortfolioCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const t = useT();
  const dict = useDict();
  const description = t(project.description);
  const truncated = description.length > 150 ? description.slice(0, 150) + "..." : description;

  return (
    <div className="portfolio-card" data-project-id={project.id} onClick={onOpen}>
      <div className="portfolio-img-box">
        <img src={assetUrl(project.thumbnail) || `https://picsum.photos/seed/${encodeURIComponent(project.title)}/800/600`} alt={`${t(project.title)} Cover Image`} />
      </div>
      <div className="portfolio-info">
        <span className="portfolio-cat">{t(project.category)}</span>
        <h3 className="portfolio-name">{t(project.title)}</h3>
        <p className="portfolio-desc">{truncated}</p>
        <span className="portfolio-action-btn">
          {dict.portfolio.viewDetails}
          <svg viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>
    </div>
  );
}
