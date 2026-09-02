import { usePortfolio } from "../../hooks/usePortfolio";
import { useT } from "../../i18n/useTranslation";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../common/Reveal";
import { CertCard } from "./CertCard";

export function Certificates() {
  const { certificates, content } = usePortfolio();
  const t = useT();

  return (
    <section id="certificates">
      <div className="container">
        <SectionHeader tag={t(content["section.certificates.tag"])} title={t(content["section.certificates.title"])} />

        <Reveal className="certs-grid" id="certificates-container">
          {certificates.map((c) => (
            <CertCard key={c.id} cert={c} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
