import { usePortfolio } from "../../../hooks/usePortfolio";
import { useDict, useT } from "../../../i18n/useTranslation";
import { sanitizeUrl } from "../../../lib/sanitize";

export function ContactChannels() {
  const { personal, content } = usePortfolio();
  const t = useT();
  const dict = useDict();

  const email = personal.email || "info@alarasysn.com";
  const instagramUrl = sanitizeUrl(personal.instagram);
  const linkedinUrl = sanitizeUrl(personal.linkedin);

  return (
    <div className="contact-channels">
      <a href={`mailto:${email}`} className="contact-button-card">
        <div className="contact-card-icon">
          <svg viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>
        <div className="contact-card-text">
          <span className="contact-card-label">{dict.contact.emailChannelLabel}</span>
          <span className="contact-card-value">{email}</span>
        </div>
      </a>

      <div className="contact-button-card">
        <div className="contact-card-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <div className="contact-card-text">
          <span className="contact-card-label">{dict.contact.locationLabel}</span>
          <span className="contact-card-value">{t(content["contact.location"])}</span>
        </div>
      </div>

      {instagramUrl && (
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="contact-button-card">
          <div className="contact-card-icon" style={{ backgroundColor: "#e1306c", color: "white" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </div>
          <div className="contact-card-text">
            <span className="contact-card-label">{dict.contact.instagramLabel}</span>
            <span className="contact-card-value">@alarasysn</span>
          </div>
        </a>
      )}

      {linkedinUrl && (
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-button-card">
          <div className="contact-card-icon" style={{ backgroundColor: "#0077b5", color: "white" }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </div>
          <div className="contact-card-text">
            <span className="contact-card-label">{dict.contact.linkedinLabel}</span>
            <span className="contact-card-value">Alara Soysan</span>
          </div>
        </a>
      )}
    </div>
  );
}
