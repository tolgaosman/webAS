import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { FolderContainer } from "../../common/FolderContainer";

export function BioCard() {
  const { bioParagraphs, content } = usePortfolio();
  const t = useT();

  return (
    <FolderContainer tabLabel={t(content["about.bioTab"])} className="about-bio-card">
      {bioParagraphs.map((p) => (
        <p key={p.id}>{t(p.body)}</p>
      ))}
    </FolderContainer>
  );
}
