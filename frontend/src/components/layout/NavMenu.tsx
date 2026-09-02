import { useDict } from "../../i18n/useTranslation";
import { LangSelector } from "./LangSelector";
import { ThemeToggle } from "./ThemeToggle";

const SECTION_IDS = ["hero", "about", "specialties", "portfolio", "resume", "certificates", "contact"] as const;

interface NavMenuProps {
  open: boolean;
  activeSection: string;
  isMobile: boolean;
  onLinkClick: () => void;
  onThemeToggle: () => void;
}

export function NavMenu({ open, activeSection, isMobile, onLinkClick, onThemeToggle }: NavMenuProps) {
  const dict = useDict();

  const labels: Record<(typeof SECTION_IDS)[number], string> = {
    hero: dict.nav.home,
    about: dict.nav.about,
    specialties: dict.nav.specialties,
    portfolio: dict.nav.portfolio,
    resume: dict.nav.resume,
    certificates: dict.nav.certificates,
    contact: dict.nav.contact,
  };

  return (
    <ul className={`nav-menu${open ? " open" : ""}`} id="nav-menu">
      {/* §Faz 5-7: the legacy script reparented the live #lang-selector
          DOM node here at <=768px because .nav-actions is display:none
          at that breakpoint (styles.css:1950). Declaratively rendering
          the same components in one of two places achieves the same
          result without DOM surgery. */}
      {isMobile && (
        <li id="mobile-lang-wrapper">
          <LangSelector onSelect={onLinkClick} />
          <ThemeToggle onClick={onThemeToggle} />
        </li>
      )}
      {SECTION_IDS.map((id) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className={`nav-link${activeSection === id ? " active" : ""}`}
            onClick={onLinkClick}
          >
            {labels[id]}
          </a>
        </li>
      ))}
    </ul>
  );
}
