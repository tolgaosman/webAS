import { useState } from "react";
import { useCrudResource } from "../../store/useCrudResource";
import { LocaleTabsProvider, LocaleTabsSwitcher } from "../../fields/LocaleTabs";
import { TranslatableInput } from "../../fields/TranslatableInput";
import { emptyLocalized, resolve } from "../../../i18n/resolve";
import type { Education } from "../../../types/portfolio";
import type { LocalizedString } from "../../../i18n/types";

export function EducationPanel() {
  const { items, loading, create, update, remove } = useCrudResource<Education>("education");
  const [editId, setEditId] = useState<number | null>(null);
  const [date, setDate] = useState<LocalizedString>(emptyLocalized());
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState<LocalizedString>(emptyLocalized());
  const [desc, setDesc] = useState<LocalizedString>(emptyLocalized());

  const reset = () => {
    setEditId(null);
    setDate(emptyLocalized());
    setSchool("");
    setDegree(emptyLocalized());
    setDesc(emptyLocalized());
  };

  const startEdit = (e: Education) => {
    setEditId(e.id);
    setDate(e.date);
    setSchool(e.school);
    setDegree(e.degree);
    setDesc(e.desc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { date, school, degree, desc };
    if (editId !== null) await update(editId, payload);
    else await create(payload);
    reset();
  };

  return (
    <div className="sub-tab-content active" id="sub-education">
      <LocaleTabsProvider>
        <form className="inline-form skill-inline-form" onSubmit={handleSubmit}>
          <LocaleTabsSwitcher />
          <TranslatableInput label="Date Range" value={date} onChange={setDate} placeholder="e.g. 2021 - Present" required />
          <div className="form-group">
            <label htmlFor="edu-school">School / Institution</label>
            <input id="edu-school" type="text" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Hogeschool Rotterdam" required />
          </div>
          <TranslatableInput label="Degree / Major" value={degree} onChange={setDegree} placeholder="e.g. International Business" required />
          <TranslatableInput label="Short Description" value={desc} onChange={setDesc} placeholder="e.g. Focus: Digital Marketing" required />
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
              <th>Date</th>
              <th>School</th>
              <th>Degree</th>
              <th>Description</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5}>Yükleniyor...</td>
              </tr>
            )}
            {items.map((e) => (
              <tr key={e.id}>
                <td>{resolve(e.date, "tr")}</td>
                <td>
                  <strong>{e.school}</strong>
                </td>
                <td>{resolve(e.degree, "tr")}</td>
                <td>
                  <span style={{ fontSize: "0.85rem" }}>{resolve(e.desc, "tr")}</span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(e)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(e.id)}>
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
