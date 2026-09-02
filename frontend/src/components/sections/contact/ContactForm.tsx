import { useState } from "react";
import { usePortfolio } from "../../../hooks/usePortfolio";
import { useDict, useT } from "../../../i18n/useTranslation";
import { sanitizeUrl } from "../../../lib/sanitize";

export function ContactForm() {
  const { personal, content } = usePortfolio();
  const t = useT();
  const dict = useDict();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert(dict.contact.validationAlert);
      return;
    }

    const whatsappText = `İsim: ${name}\nE-posta: ${email}\nMesaj: ${message}`;
    const encodedText = encodeURIComponent(whatsappText);
    const phoneNum = personal.phone ? personal.phone.replace(/[^0-9+]/g, "") : "+31625632446";
    const whatsappUrl = sanitizeUrl(`https://wa.me/${phoneNum}?text=${encodedText}`);

    if (whatsappUrl) window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="contact-form-container">
      <h3 className="form-title">{t(content["contact.formTitle"])}</h3>
      <form id="contact-form" noValidate onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="form-name">{dict.contact.nameLabel}</label>
            <input
              type="text"
              id="form-name"
              className="form-control"
              placeholder={dict.contact.namePlaceholder}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="form-email">{dict.contact.emailLabel}</label>
            <input
              type="email"
              id="form-email"
              className="form-control"
              placeholder={dict.contact.emailPlaceholder}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="form-message">{dict.contact.messageLabel}</label>
          <textarea
            id="form-message"
            className="form-control"
            placeholder={dict.contact.messagePlaceholder}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button type="submit" className="form-submit-btn whatsapp-btn">
          {dict.contact.submit}
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 0C5.385 0 0 5.387 0 12.034c0 2.12.552 4.184 1.597 6.002L.018 24l6.113-1.602c1.764.958 3.754 1.464 5.898 1.464h.004c6.645 0 12.03-5.387 12.03-12.034C24.063 5.387 18.678 0 12.031 0zm0 21.848h-.002c-1.787 0-3.535-.48-5.069-1.39l-.364-.216-3.766.988.995-3.67-.236-.376A9.972 9.972 0 0 1 2.015 12.03c0-5.525 4.496-10.02 10.016-10.02 5.518 0 10.014 4.495 10.014 10.02 0 5.526-4.496 10.018-10.014 10.018zm5.503-7.518c-.302-.15-1.787-.88-2.064-.98-.276-.1-.477-.15-.678.15-.202.302-.78 1.006-.957 1.206-.176.2-.352.226-.653.076-2.18-.844-3.585-2.034-4.542-3.654-.177-.302.2-.284.496-.874.1-.2.05-.376-.025-.526-.076-.15-.678-1.636-.93-2.242-.244-.59-.492-.51-.678-.52h-.578c-.201 0-.527.075-.803.376-.277.3-1.055 1.03-1.055 2.513s1.08 2.915 1.23 3.115c.15.2 2.124 3.242 5.143 4.544 1.94 1.207 3.38 1.207 4.133 1.056.88-.15 2.813-1.15 3.215-2.26.402-1.11.402-2.066.277-2.266-.126-.2-.453-.302-.754-.452z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
