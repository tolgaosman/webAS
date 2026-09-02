import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";

/**
 * §Faz 5-7 finding: styles.css defines `.lang-star` / `.lang-star.fill`
 * (10px round dots) and the legacy static HTML used them, but the
 * pre-rewrite TS port rendered `<svg class="star-filled/star-empty">`
 * instead — neither class exists in any CSS, so the widget rendered
 * unstyled as soon as API data loaded. Rendering `.lang-star`/`.lang-star.fill`
 * here restores the intended design.
 */
export function LanguageList() {
  const { languages } = usePortfolio();
  const t = useT();

  return (
    <div className="lang-list" id="languages-container">
      {languages.map((lang) => (
        <div className="lang-item" key={lang.id}>
          <span className="lang-name">{t(lang.name)}</span>
          <div className="lang-stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`lang-star${i < lang.stars ? " fill" : ""}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
