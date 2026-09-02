import { useState } from "react";
import { BiographyPanel } from "./content/BiographyPanel";
import { HobbiesPanel } from "./content/HobbiesPanel";
import { SpecialtiesPanel } from "./content/SpecialtiesPanel";
import { SectionHeadingsPanel } from "./content/SectionHeadingsPanel";

const SUB_TABS = [
  { id: "sub-bio", label: "Biography" },
  { id: "sub-hobbies", label: "Hobbies" },
  { id: "sub-specialties", label: "Specialties" },
  { id: "sub-content-blocks", label: "Section Headings" },
] as const;

/**
 * New tab (§Faz 5-7): edits the content that used to be hardcoded in
 * frontend/index.html and had no admin-editable home before this
 * rewrite (see backend/database/seeders/StaticContentSeeder.php).
 */
export function ContentTab() {
  const [active, setActive] = useState<(typeof SUB_TABS)[number]["id"]>("sub-bio");

  return (
    <section className="tab-content active" id="tab-content">
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

      {active === "sub-bio" && <BiographyPanel />}
      {active === "sub-hobbies" && <HobbiesPanel />}
      {active === "sub-specialties" && <SpecialtiesPanel />}
      {active === "sub-content-blocks" && <SectionHeadingsPanel />}
    </section>
  );
}
