import { useEffect } from "react";
import type { Project } from "../../../types/portfolio";
import { useDict, useT } from "../../../i18n/useTranslation";
import { useBodyScrollLock } from "../../../hooks/useBodyScrollLock";
import { ModalCarousel } from "./ModalCarousel";
import { ModalMetaSidebar } from "./ModalMetaSidebar";

interface PortfolioModalProps {
  project: Project;
  onClose: () => void;
}

/**
 * §Faz 5-7: the legacy hidden-DOM pattern (.portfolio-hidden-data,
 * read back via .innerHTML) existed only so Google Translate could
 * translate modal content that wasn't in the DOM yet. With that gone,
 * this is just props + state — no re-injection of pre-escaped HTML.
 */
export function PortfolioModal({ project, onClose }: PortfolioModalProps) {
  const t = useT();
  const dict = useDict();

  useBodyScrollLock(true);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const achievements = project.achievements.map((a) => t(a)).filter(Boolean);

  return (
    <div
      className="modal-overlay open"
      id="portfolio-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button className="modal-close-btn" id="modal-close" aria-label="Kapat" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="modal-body">
          <div className="modal-header">
            <span className="modal-category">{t(project.category)}</span>
            <h3 className="modal-title">{t(project.title)}</h3>
          </div>

          <ModalCarousel key={project.id} images={project.images} altText={t(project.title)} />

          <div className="modal-description-section">
            <div className="modal-desc-text">
              <p>{t(project.description)}</p>
              {achievements.length > 0 && (
                <>
                  <p style={{ marginTop: "1rem" }}>
                    <strong>{dict.portfolio.keyAchievements}:</strong>
                  </p>
                  <ul>
                    {achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <ModalMetaSidebar project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}
