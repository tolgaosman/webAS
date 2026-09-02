import { useState } from "react";
import { useCrudResource } from "../../store/useCrudResource";
import { ExperienceEditor } from "../../editors/ExperienceEditor";
import { resolve } from "../../../i18n/resolve";
import type { Experience } from "../../../types/portfolio";

export function ExperiencePanel() {
  const { items, loading, error, create, update, remove } = useCrudResource<Experience>("experience");
  const [editing, setEditing] = useState<Experience | null | "new">(null);

  const handleSave = async (draft: Omit<Experience, "id">) => {
    if (editing === "new") await create(draft);
    else if (editing) await update(editing.id, draft);
    setEditing(null);
  };

  return (
    <div className="sub-tab-content active" id="sub-experience">
      {error && (
        <div className="admin-info-box" role="alert">
          <p>Veri yüklenemedi: {error}</p>
        </div>
      )}
      <div className="manager-header">
        <h3>Work Experiences</h3>
        <button className="btn btn-primary" id="btn-new-exp" onClick={() => setEditing("new")}>
          Add New Experience
        </button>
      </div>

      <div className="list-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Role</th>
              <th>Company</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4}>Yükleniyor...</td>
              </tr>
            )}
            {items.map((exp) => (
              <tr key={exp.id}>
                <td>{resolve(exp.date, "tr")}</td>
                <td>
                  <strong>{resolve(exp.role, "tr")}</strong>
                </td>
                <td>{exp.company}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditing(exp)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(exp.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <ExperienceEditor experience={editing === "new" ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
