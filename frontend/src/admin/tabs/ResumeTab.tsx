import { useState } from "react";
import { EducationPanel } from "./resume/EducationPanel";
import { ExperiencePanel } from "./resume/ExperiencePanel";
import { LanguagesPanel } from "./resume/LanguagesPanel";
import { ToolkitPanel } from "./resume/ToolkitPanel";
import { CertificatesPanel } from "./resume/CertificatesPanel";

const SUB_TABS = [
  { id: "sub-education", label: "Education" },
  { id: "sub-experience", label: "Experience" },
  { id: "sub-languages", label: "Languages" },
  { id: "sub-toolkit", label: "Toolkit Skills" },
  { id: "sub-certs", label: "Certificates" },
] as const;

export function ResumeTab() {
  const [active, setActive] = useState<(typeof SUB_TABS)[number]["id"]>("sub-education");

  return (
    <section className="tab-content" id="tab-resume">
      <div className="resume-manager-tabs">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            className={`sub-tab-btn${active === t.id ? " active" : ""}`}
            data-subtab={t.id}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "sub-education" && <EducationPanel />}
      {active === "sub-experience" && <ExperiencePanel />}
      {active === "sub-languages" && <LanguagesPanel />}
      {active === "sub-toolkit" && <ToolkitPanel />}
      {active === "sub-certs" && <CertificatesPanel />}
    </section>
  );
}
