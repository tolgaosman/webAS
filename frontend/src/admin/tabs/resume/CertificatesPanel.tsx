import { useState } from "react";
import { useCrudResource } from "../../store/useCrudResource";
import { CertificateEditor } from "../../editors/CertificateEditor";
import { resolve } from "../../../i18n/resolve";
import type { Certificate } from "../../../types/portfolio";

export function CertificatesPanel() {
  const { items, loading, create, update, remove } = useCrudResource<Certificate>("certificates");
  const [editing, setEditing] = useState<Certificate | null | "new">(null);

  const handleSave = async (draft: Omit<Certificate, "id">) => {
    if (editing === "new") await create(draft);
    else if (editing) await update(editing.id, draft);
    setEditing(null);
  };

  return (
    <div className="sub-tab-content" id="sub-certs">
      <div className="manager-header">
        <h3>Certificates</h3>
        <button className="btn btn-primary" id="btn-new-cert" onClick={() => setEditing("new")}>
          Add New Certificate
        </button>
      </div>

      <div className="list-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issuer</th>
              <th>Validity</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4}>Yükleniyor...</td>
              </tr>
            )}
            {items.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{resolve(c.title, "tr")}</strong>
                </td>
                <td>{c.issuer}</td>
                <td>{resolve(c.validity, "tr")}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditing(c)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>
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
        <CertificateEditor certificate={editing === "new" ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
