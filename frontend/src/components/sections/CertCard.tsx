import { useState } from "react";
import { createPortal } from "react-dom";
import type { Certificate } from "../../types/portfolio";
import { useT } from "../../i18n/useTranslation";
import { assetUrl } from "../../lib/assetUrl";

export function CertCard({ cert }: { cert: Certificate }) {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const isHubspot = cert.issuer.toLowerCase().includes("hubspot");
  const accentStyle = isHubspot ? { color: "#ff7a59" } : undefined;

  return (
    <>
      <div className="folder-container cert-folder">
        <span className="folder-tab" style={accentStyle}>
          {cert.issuer.split(" ")[0]}
        </span>
        <img 
          className="cert-image" 
          src={assetUrl(cert.image) || `https://picsum.photos/seed/${encodeURIComponent(cert.issuer)}/600/424`} 
          alt={t(cert.title)} 
          onClick={() => setIsOpen(true)}
          style={{ cursor: "zoom-in" }}
        />
        <div className="cert-issuer-box">
          <div className="cert-issuer-icon" style={accentStyle}>
            {cert.letter}
          </div>
          <span className="cert-issuer-name">{cert.issuer}</span>
        </div>
        <h3 className="cert-title">{t(cert.title)}</h3>
        <div className="cert-body-desc">
          {t(cert.desc)}
          <div className="cert-id">{t(cert.validity)}</div>
        </div>
      </div>
      
      {isOpen && typeof document !== "undefined" && createPortal(
        <div 
          className="cert-lightbox" 
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
            padding: "2rem"
          }}
        >
          <img 
            src={assetUrl(cert.image) || `https://picsum.photos/seed/${encodeURIComponent(cert.issuer)}/600/424`} 
            alt={t(cert.title)} 
            style={{
              maxHeight: "90vh",
              maxWidth: "90vw",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }} 
          />
        </div>,
        document.body
      )}
    </>
  );
}
