import { useState } from "react";
import { useCrudResource } from "../store/useCrudResource";
import { LocaleTabsProvider, LocaleTabsSwitcher } from "../fields/LocaleTabs";
import { TranslatableInput } from "../fields/TranslatableInput";
import { emptyLocalized, resolve } from "../../i18n/resolve";
import type { CoreSkill } from "../../types/portfolio";
import type { LocalizedString } from "../../i18n/types";

export function SkillsTab() {
  const { items, loading, create, update, remove } = useCrudResource<CoreSkill>("core-skills");
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState<LocalizedString>(emptyLocalized());
  const [desc, setDesc] = useState<LocalizedString>(emptyLocalized());

  const resetForm = () => {
    setEditId(null);
    setTitle(emptyLocalized());
    setDesc(emptyLocalized());
  };

  const startEdit = (skill: CoreSkill) => {
    setEditId(skill.id);
    setTitle(skill.title);
    setDesc(skill.desc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, desc };
    if (editId !== null) {
      await update(editId, payload);
    } else {
      await create(payload);
    }
    resetForm();
  };

  return (
    <section className="tab-content" id="tab-skills">
      <div className="admin-info-box">
        <p>
          <strong>Skill Layout:</strong> Added skills are listed in 5 columns under "Core Skills" on the main page.
          The 6th element and beyond will wrap to the next row.
        </p>
      </div>

      <div className="skills-manager">
        <LocaleTabsProvider>
          <form className="inline-form skill-inline-form" onSubmit={handleSubmit}>
            <LocaleTabsSwitcher />
            <TranslatableInput label="Skill Title" value={title} onChange={setTitle} placeholder="e.g. Digital Content Creation" required />
            <TranslatableInput label="Skill Description" value={desc} onChange={setDesc} placeholder="e.g. Social media and video design" required />
            <div className="skill-form-actions">
              <button type="submit" className="btn btn-primary">
                {editId !== null ? "Save Changes" : "Add"}
              </button>
              {editId !== null && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
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
                <th>Skill Title</th>
                <th>Skill Description</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3}>Yükleniyor...</td>
                </tr>
              )}
              {items.map((skill) => (
                <tr key={skill.id}>
                  <td>
                    <strong>{resolve(skill.title, "tr")}</strong>
                  </td>
                  <td>{resolve(skill.desc, "tr")}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => startEdit(skill)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(skill.id)}>
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
    </section>
  );
}
