import { usePortfolio } from "../../hooks/usePortfolio";
import { useT } from "../../i18n/useTranslation";

export function Footer() {
  const { personal, content } = usePortfolio();
  const t = useT();

  const [first, ...rest] = personal.name.split(" ");
  const copyTemplate = t(content["footer.copy"]) || "© {year} {name}. Vintage Marketing Concept.";
  const copy = copyTemplate
    .replace("{year}", String(new Date().getFullYear()))
    .replace("{name}", personal.name);

  return (
    <footer>
      <div className="container footer-container">
        <a href="#hero" className="footer-logo">
          {first} <span>{rest.join(" ")}.</span>
        </a>
        <p className="footer-copy">{copy}</p>
      </div>
    </footer>
  );
}
