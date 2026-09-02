import { useState } from "react";
import { useCrudResource } from "../../store/useCrudResource";
import { LocaleTabsProvider, LocaleTabsSwitcher } from "../../fields/LocaleTabs";
import { TranslatableInput } from "../../fields/TranslatableInput";
import { TranslatableTextarea } from "../../fields/TranslatableTextarea";
import { FileUploadField } from "../../fields/FileUploadField";
import { emptyLocalized, resolve } from "../../../i18n/resolve";
import type { Specialty } from "../../../types/content";

type Draft = Omit<Specialty, "id">;
const emptyDraft = (): Draft => ({ image: "", title: emptyLocalized(), desc: emptyLocalized(), ctaLabel: emptyLocalized(), ctaHref: "" });

export function SpecialtiesPanel() {
  const { items, loading, error, create, update, remove } = useCrudResource<Specialty>("specialties");
  const [editId, setEditId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const startEdit = (s: Specialty) => {
    setEditId(s.id);
    setDraft(s);
  };

  const reset = () => {
    setEditId(null);
    setDraft(emptyDraft());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) await update(editId, draft);
    else await create(draft);
    reset();
  };

  return (
    <div className="sub-tab-content active" id="sub-specialties">
      {error && (
        <div className="admin-info-box" role="alert">
          <p>Veri yüklenemedi: {error}</p>
        </div>
      )}
      <div className="admin-info-box">
        <p>The 3 "Uzmanlık Alanları" panels shown between About and Portfolio.</p>
      </div>

      <LocaleTabsProvider>
        <form className="admin-form" onSubmit={handleSubmit}>
          <LocaleTabsSwitcher />
          <div className="form-grid">
            <div className="col-span-2">
              <FileUploadField label="Image" value={draft.image} onChange={(v) => set("image", v)} />
            </div>
            <TranslatableInput label="Title" value={draft.title} onChange={(v) => set("title", v)} required />
            <div className="form-group">
              <label>CTA Link Target (anchor)</label>
              <input type="text" value={draft.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} placeholder="#portfolio" required />
            </div>
            <TranslatableInput label="CTA Label" value={draft.ctaLabel} onChange={(v) => set("ctaLabel", v)} placeholder="e.g. projeleri gör" required />
          </div>
          <TranslatableTextarea label="Description" value={draft.desc} onChange={(v) => set("desc", v)} rows={2} fullWidth required />
          <div className="editor-actions">
            {editId !== null && (
              <button type="button" className="btn btn-secondary" onClick={reset}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {editId !== null ? "Save Changes" : "Add Specialty"}
            </button>
          </div>
        </form>
      </LocaleTabsProvider>

      <div className="list-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>CTA</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3}>Yükleniyor...</td>
              </tr>
            )}
            {items.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{resolve(s.title, "tr")}</strong>
                </td>
                <td>{resolve(s.ctaLabel, "tr")} → {s.ctaHref}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(s)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>
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
