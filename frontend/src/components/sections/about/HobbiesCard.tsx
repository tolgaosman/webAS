import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { FolderContainer } from "../../common/FolderContainer";

export function HobbiesCard() {
  const { hobbies, content } = usePortfolio();
  const t = useT();

  return (
    <FolderContainer tabLabel={t(content["about.interestsTab"])} className="about-interests-card">
      <h3>{t(content["about.interestsHeading"])}</h3>
      <div className="hobbies-list">
        {hobbies.map((h) => (
          <div key={h.id} className="hobby-item">
            <span style={{ fontSize: "1.2rem" }}>{h.icon}</span>
            {t(h.label)}
          </div>
        ))}
      </div>
    </FolderContainer>
  );
}
