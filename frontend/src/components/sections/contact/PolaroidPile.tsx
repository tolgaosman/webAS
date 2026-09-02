import { usePortfolio } from "../../../hooks/usePortfolio";
import { useDict } from "../../../i18n/useTranslation";
import { assetUrl } from "../../../lib/assetUrl";

const PLACEHOLDER_IMG = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function PolaroidPile() {
  const { personal } = usePortfolio();
  const dict = useDict();
  const profileSrc = assetUrl(personal.profileImage) || PLACEHOLDER_IMG;

  return (
    <div className="polaroid-pile">
      <div className="polaroid-pile-item pile-1">
        <img src="/assets/images/yogaProject/kapak.jpeg" alt="Yoga Project Cover" />
        <p>{dict.contact.pile1Caption}</p>
      </div>
      <div className="polaroid-pile-item pile-2">
        <img src={profileSrc} alt="Alara Soysan Profile" />
        <p>{dict.contact.pile2Caption}</p>
      </div>
    </div>
  );
}
