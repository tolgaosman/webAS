import { useEffect, useState } from "react";
import type { Experience } from "../../types/portfolio";
import type { LocalizedString } from "../../i18n/types";
import { emptyLocalized } from "../../i18n/resolve";
import { usePanelLocale, LocaleTabsProvider, LocaleTabsSwitcher } from "../fields/LocaleTabs";
import { TranslatableInput } from "../fields/TranslatableInput";

type ExperienceDraft = Omit<Experience, "id">;

const emptyDraft = (): ExperienceDraft => ({
  date: emptyLocalized(),
  role: emptyLocalized(),
  company: "",
  accomplishments: [],
});

function AccomplishmentsField({ value, onChange }: { value: LocalizedString[]; onChange: (v: LocalizedString[]) => void }) {
  const { active } = usePanelLocale();
  const text = value.map((a) => a[active]).join("\n");

  const handleChange = (raw: string) => {
    const lines = raw.split("\n");
    onChange(lines.map((line, i) => ({ ...(value[i] ?? emptyLocalized()), [active]: line })));
  };

  return (
    <div className="form-group" style={{ marginTop: "1rem" }}>
      <label>Accomplishments & Responsibilities — one item per line ({active.toUpperCase()})</label>
      <textarea
        rows={5}
        required
        value={text}
        placeholder={"Social media video designs created.\nVisual communication processes managed."}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}

interface ExperienceEditorProps {
  experience: Experience | null;
  onSave: (draft: ExperienceDraft) => Promise<void>;
  onClose: () => void;
}

export function ExperienceEditor({ experience, onSave, onClose }: ExperienceEditorProps) {
  const [draft, setDraft] = useState<ExperienceDraft>(experience ?? emptyDraft());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(experience ?? emptyDraft());
  }, [experience]);

  const set = <K extends keyof ExperienceDraft>(key: K, value: ExperienceDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const accomplishments = draft.accomplishments.filter((a) => a.tr.trim() || a.en.trim() || a.nl.trim());
      await onSave({ ...draft, accomplishments });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor-overlay" id="exp-editor-modal">
      <div className="folder-container editor-card" style={{ maxWidth: 600 }}>
        <span className="folder-tab">Experience Details</span>
        <div className="editor-header">
          <h2>Add/Edit Work Experience</h2>
          <button className="btn-close" id="exp-editor-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="editor-body">
          <LocaleTabsProvider>
            <form id="exp-form" onSubmit={handleSubmit}>
              <LocaleTabsSwitcher />
              <div className="form-grid">
                <TranslatableInput label="Date Range" value={draft.date} onChange={(v) => set("date", v)} required placeholder="e.g. FEBRUARY 2026 - PRESENT" />
                <TranslatableInput label="Role" value={draft.role} onChange={(v) => set("role", v)} required placeholder="e.g. HR & Branding Intern" />
                <div className="form-group">
                  <label htmlFor="exp-company">Company / Institution</label>
                  <input id="exp-company" type="text" value={draft.company} onChange={(e) => set("company", e.target.value)} required placeholder="e.g. Turkcell" />
                </div>
              </div>

              <AccomplishmentsField value={draft.accomplishments} onChange={(v) => set("accomplishments", v)} />

              <div className="editor-actions">
                <button type="button" className="btn btn-secondary" id="btn-cancel-exp" onClick={onClose}>
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
