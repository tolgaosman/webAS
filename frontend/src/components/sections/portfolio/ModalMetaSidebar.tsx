import type { Project } from "../../../types/portfolio";
import { useDict, useT } from "../../../i18n/useTranslation";

/** Mirrors the legacy renderer's className REASSIGNMENT exactly (not an
 *  append) — a UNSDG-11/12 goal badge gets ONLY "unsdg-badge goal-11/12",
 *  never "retro-badge" too. */
function goalBadgeClass(goal: string): string {
  if (goal.includes("UNSDG 11")) return "unsdg-badge goal-11";
  if (goal.includes("UNSDG 12")) return "unsdg-badge goal-12";
  return "retro-badge";
}

export function ModalMetaSidebar({ project }: { project: Project }) {
  const t = useT();
  const dict = useDict();

  // Legacy fallback chain reduces to just metaClient here — the
  // "course"/"project type" variants only ever existed in the
  // hardcoded static HTML modal, never in the data model (see
  // migration plan §Faz 5-7, "bilinçli kayıplar").
  const clientValue = t(project.metaClient) || dict.modal.personalProject;
  const clientLabel = t(project.metaClientLabel) || dict.modal.client;

  const goals = t(project.goals)
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  return (
    <div className="modal-meta-sidebar">
      <div className="modal-meta-box">
        <h5>{dict.modal.role}</h5>
        <p className="meta-role">{t(project.metaRole) || "-"}</p>
      </div>
      <div className="modal-meta-box">
        <h5 className="client-label">{clientLabel}</h5>
        <p className="meta-client">{clientValue}</p>
      </div>
      <div className="modal-meta-box">
        <h5>{dict.modal.tools}</h5>
        <p className="meta-tools">{t(project.metaTools) || "-"}</p>
      </div>
      <div className="modal-meta-box">
        <h5>{dict.modal.focus}</h5>
        <p className="meta-category">{t(project.metaCategory) || "-"}</p>
      </div>
      <div>
        <h5
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
            fontWeight: 800,
          }}
        >
          {dict.modal.achievements}
        </h5>
        <div className="modal-goal-badges">
          {goals.map((goal, i) => (
            <span key={i} className={goalBadgeClass(goal)}>
              {goal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
