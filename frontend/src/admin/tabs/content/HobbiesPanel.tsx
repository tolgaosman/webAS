import { useState } from "react";
import { useCrudResource } from "../../store/useCrudResource";
import { TranslatableInput } from "../../fields/TranslatableInput";
import { emptyLocalized, resolve } from "../../../i18n/resolve";
import type { Hobby } from "../../../types/content";
import type { LocalizedString } from "../../../i18n/types";

export function HobbiesPanel() {
  const { items, loading, error, create, update, remove } = useCrudResource<Hobby>("hobbies");
  const [editId, setEditId] = useState<number | null>(null);
  const [icon, setIcon] = useState("");
  const [label, setLabel] = useState<LocalizedString>(emptyLocalized());

  const reset = () => {
    setEditId(null);
    setIcon("");
    setLabel(emptyLocalized());
  };

  const startEdit = (h: Hobby) => {
    setEditId(h.id);
    setIcon(h.icon);
    setLabel(h.label);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { icon, label };
    if (editId !== null) await update(editId, payload);
    else await create(payload);
    reset();
  };

  return (
    <div className="sub-tab-content active" id="sub-hobbies">
      {error && (
        <div className="admin-info-box" role="alert">
          <p>Veri yüklenemedi: {error}</p>
        </div>
      )}
      <form className="inline-form skill-inline-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="hobby-icon">Emoji</label>
          <input id="hobby-icon" type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🧘🏻‍♀️" required maxLength={8} />
        </div>
        <TranslatableInput label="Label" value={label} onChange={setLabel} placeholder="e.g. Yoga" required />
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

      <div className="badges-manager-flex">
        {loading && <p>Yükleniyor...</p>}
        {items.map((h) => (
          <span className="badge-editable" key={h.id} onClick={() => startEdit(h)} style={{ cursor: "pointer" }}>
            <span>
              {h.icon} {resolve(h.label, "tr")}
            </span>
            <button
              className="remove-badge-btn"
              onClick={(e) => {
                e.stopPropagation();
                remove(h.id);
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
