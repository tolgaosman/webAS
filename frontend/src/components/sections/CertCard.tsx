import type { Certificate } from "../../types/portfolio";
import { useT } from "../../i18n/useTranslation";
import { assetUrl } from "../../lib/assetUrl";

export function CertCard({ cert }: { cert: Certificate }) {
  const t = useT();
  const isHubspot = cert.issuer.toLowerCase().includes("hubspot");
  const accentStyle = isHubspot ? { backgroundColor: "#ff7a59", color: "white" } : undefined;

  return (
    <div className="folder-container cert-folder">
      <span className="folder-tab" style={accentStyle}>
        {cert.issuer.split(" ")[0]}
      </span>
      <img className="cert-image" src={assetUrl(cert.image)} alt={t(cert.title)} />
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
  );
}
