import { useState } from "react";
import { useCrudResource } from "../../store/useCrudResource";
import { LocaleTabsProvider, LocaleTabsSwitcher } from "../../fields/LocaleTabs";
import { TranslatableInput } from "../../fields/TranslatableInput";
import { emptyLocalized, resolve } from "../../../i18n/resolve";
import type { Toolkit } from "../../../types/portfolio";
import type { LocalizedString } from "../../../i18n/types";

export function ToolkitPanel() {
  const { items, create, remove } = useCrudResource<Toolkit>("toolkit");
  const [badge, setBadge] = useState<LocalizedString>(emptyLocalized());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({ badge });
    setBadge(emptyLocalized());
  };

  return (
    <div className="sub-tab-content" id="sub-toolkit">
      <div className="admin-info-box">
        <p>Add or remove toolkit skill badges.</p>
      </div>
      <LocaleTabsProvider>
        <form className="inline-form skill-inline-form" onSubmit={handleSubmit}>
          <LocaleTabsSwitcher />
          <TranslatableInput label="Add New Badge" value={badge} onChange={setBadge} placeholder="e.g. Microsoft Office" required />
          <div className="skill-form-actions">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </div>
        </form>
      </LocaleTabsProvider>

      <div className="badges-manager-flex">
        {items.map((t) => (
          <span className="badge-editable" key={t.id}>
            <span>{resolve(t.badge, "tr")}</span>
            <button className="remove-badge-btn" onClick={() => remove(t.id)}>
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
