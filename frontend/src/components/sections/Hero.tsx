import { usePortfolio } from "../../hooks/usePortfolio";
import { useT } from "../../i18n/useTranslation";
import { Reveal } from "../common/Reveal";
import { FolderContainer } from "../common/FolderContainer";
import { assetUrl } from "../../lib/assetUrl";
import { sanitizeUrl } from "../../lib/sanitize";

const PLACEHOLDER_IMG = "https://ui-avatars.com/api/?name=Alara+Soysan&background=ec829c&color=fff&size=512&font-size=0.33";

export function Hero() {
  const { personal, content } = usePortfolio();
  const t = useT();

  const profileSrc = assetUrl(personal.profileImage) || PLACEHOLDER_IMG;

  return (
    <section id="hero">
      <div className="container hero-grid">
        <Reveal className="hero-visual" active>
          <div className="polaroid-frame">
            <div className="polaroid-image-box">
              <img src={profileSrc} alt="Alara Soysan Portrait" />
            </div>
            <div className="polaroid-caption">{personal.name}</div>
          </div>
        </Reveal>

        <Reveal className="hero-content" active style={{ transitionDelay: "0.1s" }}>
          <div className="hero-title-group">
            <span className="hero-marketing-label">{t(content["hero.marketingLabel"])}</span>
            <h1 className="hero-main-title">
              {t(content["hero.titleLine1"])}
              <br />
              {t(content["hero.titleLine2"])}
            </h1>
            <span className="hero-by-line">
              {personal.name} {t(content["hero.bylineSuffix"])}
            </span>
          </div>

          <FolderContainer tabLabel={t(content["hero.folderTab"])} className="hero-desc-folder">
            <p>{t(content["hero.intro"])}</p>
            <div className="hero-actions">
              <a href="#portfolio" className="btn btn-primary">
                {t(content["hero.ctaPortfolio"])}
              </a>
              <a href="#contact" className="btn btn-secondary">
                {t(content["hero.ctaContact"])}
              </a>

              <div className="hero-socials">
                <a href={sanitizeUrl(personal.linkedin) || "#"} target="_blank" rel="noopener" className="social-btn" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href={sanitizeUrl(personal.instagram) || "#"} target="_blank" rel="noopener" className="social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </FolderContainer>
        </Reveal>
      </div>
    </section>
  );
}
