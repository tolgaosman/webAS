import { useEffect, useState } from "react";
import type { Certificate } from "../../types/portfolio";
import { emptyLocalized } from "../../i18n/resolve";
import { LocaleTabsProvider, LocaleTabsSwitcher } from "../fields/LocaleTabs";
import { TranslatableInput } from "../fields/TranslatableInput";
import { TranslatableTextarea } from "../fields/TranslatableTextarea";
import { FileUploadField } from "../fields/FileUploadField";

type CertificateDraft = Omit<Certificate, "id">;

const emptyDraft = (): CertificateDraft => ({
  title: emptyLocalized(),
  issuer: "",
  letter: "",
  image: "",
  validity: emptyLocalized(),
  desc: emptyLocalized(),
});

interface CertificateEditorProps {
  certificate: Certificate | null;
  onSave: (draft: CertificateDraft) => Promise<void>;
  onClose: () => void;
}

export function CertificateEditor({ certificate, onSave, onClose }: CertificateEditorProps) {
  const [draft, setDraft] = useState<CertificateDraft>(certificate ?? emptyDraft());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(certificate ?? emptyDraft());
  }, [certificate]);

  const set = <K extends keyof CertificateDraft>(key: K, value: CertificateDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor-overlay" id="cert-editor-modal">
      <div className="folder-container editor-card" style={{ maxWidth: 600 }}>
        <span className="folder-tab">Certificate Details</span>
        <div className="editor-header">
          <h2>Add/Edit Certificate</h2>
          <button className="btn-close" id="cert-editor-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="editor-body">
          <LocaleTabsProvider>
            <form id="cert-form" onSubmit={handleSubmit}>
              <LocaleTabsSwitcher />
              <div className="form-grid">
                <TranslatableInput label="Certificate Title" value={draft.title} onChange={(v) => set("title", v)} required placeholder="e.g. Email Marketing Certification" />
                <div className="form-group">
                  <label htmlFor="cert-issuer">Issuing Institution</label>
                  <input id="cert-issuer" type="text" value={draft.issuer} onChange={(e) => set("issuer", e.target.value)} required placeholder="e.g. HubSpot Academy" />
                </div>
                <div className="form-group">
                  <label htmlFor="cert-issuer-letter">Initial / Logo Text</label>
                  <input id="cert-issuer-letter" type="text" maxLength={2} value={draft.letter} onChange={(e) => set("letter", e.target.value)} required placeholder="e.g. H" />
                </div>
                <div className="col-span-2">
                  <FileUploadField label="Certificate Image" value={draft.image} onChange={(v) => set("image", v)} />
                </div>
                <TranslatableInput label="Validity Date" value={draft.validity} onChange={(v) => set("validity", v)} required placeholder="e.g. Validity: Jan 2026 - Feb 2028" />
              </div>

              <TranslatableTextarea label="Certificate Description" value={draft.desc} onChange={(v) => set("desc", v)} required rows={3} fullWidth />

              <div className="editor-actions">
                <button type="button" className="btn btn-secondary" id="btn-cancel-cert" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </LocaleTabsProvider>
        </div>
      </div>
    </div>
  );
}
