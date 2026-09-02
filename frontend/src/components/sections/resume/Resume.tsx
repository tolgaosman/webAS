import { usePortfolio } from "../../../hooks/usePortfolio";
import { useT } from "../../../i18n/useTranslation";
import { SectionHeader } from "../../common/SectionHeader";
import { Reveal } from "../../common/Reveal";
import { FolderContainer } from "../../common/FolderContainer";
import { EducationTimeline, ExperienceTimeline } from "./Timeline";
import { LanguageList } from "./LanguageList";
import { Toolkit } from "./Toolkit";
import { ResumeActions } from "./ResumeActions";

export function Resume() {
  const { content } = usePortfolio();
  const t = useT();

  return (
    <section id="resume">
      <div className="container">
        <SectionHeader tag={t(content["section.resume.tag"])} title={t(content["section.resume.title"])} />

        <Reveal className="resume-layout">
          <div className="resume-folders">
            <FolderContainer
              tabLabel={t(content["resume.educationTab"])}
              tabStyle={{ backgroundColor: "var(--secondary-accent)", color: "white" }}
            >
              <div className="resume-folder-content">
                <EducationTimeline />
              </div>
            </FolderContainer>

            <FolderContainer
              tabLabel={t(content["resume.experienceTab"])}
              tabStyle={{ backgroundColor: "var(--yellow-accent)" }}
            >
              <div className="resume-folder-content">
                <ExperienceTimeline />
              </div>
            </FolderContainer>
          </div>

          <div className="resume-sidebar">
            <FolderContainer tabLabel={t(content["resume.languagesTab"])}>
              <div className="sidebar-folder-body">
                <h3 className="sidebar-title">{t(content["resume.languagesHeading"])}</h3>
                <LanguageList />
              </div>
            </FolderContainer>

            <FolderContainer tabLabel={t(content["resume.toolkitTab"])}>
              <div className="sidebar-folder-body">
                <h3 className="sidebar-title">{t(content["resume.toolkitHeading"])}</h3>
                <Toolkit />
              </div>
            </FolderContainer>

            <ResumeActions />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
