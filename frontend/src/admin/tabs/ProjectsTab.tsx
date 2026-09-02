import { useState } from "react";
import { useCrudResource } from "../store/useCrudResource";
import { ProjectEditor } from "../editors/ProjectEditor";
import { assetUrl } from "../../lib/assetUrl";
import { resolve } from "../../i18n/resolve";
import type { Project } from "../../types/portfolio";

export function ProjectsTab() {
  const { items, loading, create, update, remove } = useCrudResource<Project>("projects");
  const [editing, setEditing] = useState<Project | null | "new">(null);

  const handleSave = async (draft: Omit<Project, "id">) => {
    if (editing === "new") {
      await create(draft);
    } else if (editing) {
      await update(editing.id, draft);
    }
    setEditing(null);
  };

  return (
    <section className="tab-content" id="tab-projects">
      <div className="projects-manager">
        <div className="manager-header">
          <h3>Project List</h3>
          <button className="btn btn-primary" id="btn-new-project" onClick={() => setEditing("new")}>
            Add New Project
          </button>
        </div>

        <div className="list-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Project Title</th>
                <th>Category</th>
                <th>Detail Images</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5}>Yükleniyor...</td>
                </tr>
              )}
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={assetUrl(p.thumbnail)} className="project-thumb-preview" alt="" />
                  </td>
                  <td>
                    <strong>{resolve(p.title, "tr")}</strong>
                  </td>
                  <td>
                    <span className="admin-tag" style={{ backgroundColor: "var(--folder-bg)" }}>
                      {resolve(p.category, "tr")}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{p.images.length} images</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditing(p)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>
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

      {editing !== null && (
        <ProjectEditor project={editing === "new" ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </section>
  );
}
