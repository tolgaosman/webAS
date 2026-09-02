import type { Specialty } from "../../types/content";
import { useT } from "../../i18n/useTranslation";
import { assetUrl } from "../../lib/assetUrl";

export function SpecialtyPanel({ specialty }: { specialty: Specialty }) {
  const t = useT();

  return (
    <div className="specialty-panel">
      <div className="specialty-frame">
        <img src={assetUrl(specialty.image)} alt={`Alara Soysan - ${t(specialty.title)}`} />
      </div>
      <h3 className="specialty-title">{t(specialty.title)}</h3>
      <p className="specialty-desc">{t(specialty.desc)}</p>
      <a href={specialty.ctaHref} className="btn btn-secondary">
        {t(specialty.ctaLabel)}
      </a>
    </div>
  );
}
