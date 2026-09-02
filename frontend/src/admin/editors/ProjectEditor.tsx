import { useEffect, useState } from "react";
import type { Project } from "../../types/portfolio";
import type { LocalizedString } from "../../i18n/types";
import { emptyLocalized } from "../../i18n/resolve";
import { TranslatableInput } from "../fields/TranslatableInput";
import { TranslatableTextarea } from "../fields/TranslatableTextarea";
import { FileUploadField } from "../fields/FileUploadField";
import { MultiFileUploadField } from "../fields/MultiFileUploadField";

type ProjectDraft = Omit<Project, "id">;

const emptyDraft = (): ProjectDraft => ({
  title: emptyLocalized(),
  category: emptyLocalized(),
  thumbnail: "",
  images: [],
  description: emptyLocalized(),
  metaRole: emptyLocalized(),
  metaClientLabel: emptyLocalized(),
  metaClient: emptyLocalized(),
  metaTools: emptyLocalized(),
  metaCategory: emptyLocalized(),
  goals: emptyLocalized(),
  achievements: [],
});

function AchievementsField({ value, onChange }: { value: LocalizedString[]; onChange: (v: LocalizedString[]) => void }) {
  const text = value.map((a) => a.tr).join("\n");

  const handleChange = (raw: string) => {
    const lines = raw.split("\n");
    // Unchanged line: keep it exactly as-is so its already-translated
    // en/nl survive. Edited/new line: reset en/nl blank so the backend's
    // auto-translate (Translatable::set()) knows to re-translate from
    // the new text instead of trusting stale leftovers (these rows are
    // deleted and recreated on every save).
    const next = lines.map((line, i) => {
      const prev = value[i];
      return prev && prev.tr === line ? prev : { ...emptyLocalized(), tr: line };
    });
    onChange(next);
  };

  return (
    <div className="form-group">
      <label>Write one point per line</label>
      <span className="form-group-hint">Herhangi bir dilde yazın — kaydedince diğer diller otomatik çevrilir.</span>
      <textarea
        rows={4}
        value={text}
        placeholder={"Visual design system developed with Canva.\nSocial media engagement increased."}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}

interface ProjectEditorProps {
  project: Project | null; // null = create mode
  onSave: (draft: ProjectDraft) => Promise<void>;
  onClose: () => void;
}

export function ProjectEditor({ project, onSave, onClose }: ProjectEditorProps) {
  const [draft, setDraft] = useState<ProjectDraft>(project ?? emptyDraft());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(project ?? emptyDraft());
  }, [project]);

  const set = <K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Drop empty trailing achievement lines from the textarea split.
      const achievements = draft.achievements.filter((a) => a.tr.trim() || a.en.trim() || a.nl.trim());
      await onSave({ ...draft, achievements });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor-overlay" id="project-editor-modal">
      <div className="folder-container editor-card">
        <span className="folder-tab" id="editor-title-label">
          {project ? "Edit Project" : "Add New Project"}
        </span>
        <div className="editor-header">
          <h2 id="project-editor-title">Add/Edit Project</h2>
          <button className="btn-close" id="project-editor-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="editor-body">
          <form id="project-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <TranslatableInput label="Project Title" value={draft.title} onChange={(v) => set("title", v)} required />
              <TranslatableInput label="Category (Will Show on Card)" value={draft.category} onChange={(v) => set("category", v)} required placeholder="e.g. SOCIAL MEDIA STRATEGY" />
              <div className="col-span-2">
                <FileUploadField label="Thumbnail" value={draft.thumbnail} onChange={(v) => set("thumbnail", v)} />
              </div>
              <div className="col-span-2">
                <MultiFileUploadField label="Carousel Images (Multiple Selection)" paths={draft.images} onChange={(v) => set("images", v)} />
              </div>
            </div>

            <TranslatableTextarea label="Project Description" value={draft.description} onChange={(v) => set("description", v)} required rows={4} fullWidth />

            <h3 className="editor-section-title">Detail Card Widget Info (Right Panel)</h3>
            <div className="form-grid">
              <TranslatableInput label="Role / Scope" value={draft.metaRole} onChange={(v) => set("metaRole", v)} placeholder="e.g. Branding & Content Creator" />
              <TranslatableInput label="Client / Group Label" value={draft.metaClientLabel} onChange={(v) => set("metaClientLabel", v)} placeholder="e.g. CLIENT / GROUP" />
              <TranslatableInput label="Client / Group Value" value={draft.metaClient} onChange={(v) => set("metaClient", v)} placeholder="e.g. de Schouw (Team Iron Man 4)" />
              <TranslatableInput label="Essential Tools" value={draft.metaTools} onChange={(v) => set("metaTools", v)} placeholder="e.g. Canva, Photoshop, CapCut" />
              <TranslatableInput label="Focus / Category" value={draft.metaCategory} onChange={(v) => set("metaCategory", v)} placeholder="e.g. Digital Marketing & Branding" />
              <div className="form-group">
                <label htmlFor="proj-goals">UNSDGs (e.g. UNSDG 11, UNSDG 12)</label>
                <input id="proj-goals" type="text" value={draft.goals.tr} onChange={(e) => set("goals", { tr: e.target.value, en: e.target.value, nl: e.target.value })} placeholder="e.g. UNSDG 11, UNSDG 12" />
              </div>
            </div>

            <h3 className="editor-section-title" style={{ marginTop: "1.5rem" }}>
              Key Achievements (Bullet Points)
            </h3>
            <AchievementsField value={draft.achievements} onChange={(v) => set("achievements", v)} />

            <div className="editor-actions">
              <button type="button" className="btn btn-secondary" id="btn-cancel-project" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
