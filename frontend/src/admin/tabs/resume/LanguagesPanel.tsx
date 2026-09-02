import { useState } from "react";
import { useCrudResource } from "../../store/useCrudResource";
import { LocaleTabsProvider, LocaleTabsSwitcher } from "../../fields/LocaleTabs";
import { TranslatableInput } from "../../fields/TranslatableInput";
import { emptyLocalized, resolve } from "../../../i18n/resolve";
import type { Language } from "../../../types/portfolio";
import type { LocalizedString } from "../../../i18n/types";

export function LanguagesPanel() {
  const { items, loading, create, update, remove } = useCrudResource<Language>("languages");
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState<LocalizedString>(emptyLocalized());
  const [stars, setStars] = useState(5);

  const reset = () => {
    setEditId(null);
    setName(emptyLocalized());
    setStars(5);
  };

  const startEdit = (l: Language) => {
    setEditId(l.id);
    setName(l.name);
    setStars(l.stars);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, stars };
    if (editId !== null) await update(editId, payload);
    else await create(payload);
    reset();
  };

  return (
    <div className="sub-tab-content" id="sub-languages">
      <LocaleTabsProvider>
        <form className="inline-form skill-inline-form" onSubmit={handleSubmit}>
          <LocaleTabsSwitcher />
          <TranslatableInput label="Language & Level" value={name} onChange={setName} placeholder="e.g. English (C2 Professional)" required />
          <div className="form-group">
            <label htmlFor="lang-stars">Star Level (1 - 5)</label>
            <input id="lang-stars" type="number" min={1} max={5} value={stars} onChange={(e) => setStars(Number(e.target.value))} required />
          </div>
          <div className="skill-form-actions">
            <button type="submit" className="btn btn-primary">
              {editId !== null ? "Save Changes" : "Add"}
            </button>
            {editId !== null && (
              <button type="button" className="btn btn-secondary" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </LocaleTabsProvider>

      <div className="list-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Language & Level</th>
              <th>Star Rating</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3}>Yükleniyor...</td>
              </tr>
            )}
            {items.map((l) => (
              <tr key={l.id}>
                <td>
                  <strong>{resolve(l.name, "tr")}</strong>
                </td>
                <td style={{ color: "var(--primary-accent)", fontSize: "1.1rem" }}>
                  {"★".repeat(l.stars)}
                  {"☆".repeat(5 - l.stars)}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(l)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(l.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
