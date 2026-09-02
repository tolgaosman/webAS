import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { RetroBadge } from "../../common/RetroBadge";

export function Toolkit() {
  const { toolkit } = usePortfolio();
  const t = useT();

  return (
    <div className="badges-flex" id="toolkit-container">
      {toolkit.map((item) => (
        <RetroBadge key={item.id}>{t(item.badge)}</RetroBadge>
      ))}
    </div>
  );
}
