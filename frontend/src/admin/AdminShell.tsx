import { useEffect, useState } from "react";
import { checkSession, logout } from "../lib/adminApi";
import { LoginCard } from "./LoginCard";
import { PersonalTab } from "./tabs/PersonalTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { ResumeTab } from "./tabs/ResumeTab";
import { ContentTab } from "./tabs/ContentTab";

const TABS = [
  { id: "tab-personal", label: "Personal Details" },
  { id: "tab-skills", label: "Core Skills" },
  { id: "tab-projects", label: "Project Management" },
  { id: "tab-resume", label: "Resume & Certificates" },
  { id: "tab-content", label: "Site Content" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminShell() {
  const [authState, setAuthState] = useState<"checking" | "anon" | "authed">("checking");
  const [activeTab, setActiveTab] = useState<TabId>(
    (window.location.hash.replace("#", "") as TabId) || "tab-personal"
  );

  useEffect(() => {
    checkSession().then((ok) => setAuthState(ok ? "authed" : "anon"));
  }, []);

  const selectTab = (id: TabId) => {
    setActiveTab(id);
    window.location.hash = id;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="admin-bg-pattern"></div>

      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src="/siteLogo.png" alt="Alara Soysan Logo" className="nav-logo-img" height={60} style={{ maxHeight: 60, width: "auto", display: "block" }} />
            <span className="admin-tag">Admin Panel</span>
          </div>
          {authState === "authed" && (
            <div className="admin-nav-actions">
              <button className="btn btn-secondary logout-btn" id="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {authState === "anon" && <LoginCard onLoggedIn={() => setAuthState("authed")} />}

      {authState === "authed" && (
        <main className="admin-main container" id="admin-main">
          <div className="admin-folder-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab-btn${activeTab === t.id ? " active" : ""}`}
                data-tab={t.id}
                onClick={() => selectTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="folder-container admin-body-folder">
            {activeTab === "tab-personal" && <PersonalTab />}
            {activeTab === "tab-skills" && <SkillsTab />}
            {activeTab === "tab-projects" && <ProjectsTab />}
            {activeTab === "tab-resume" && <ResumeTab />}
            {activeTab === "tab-content" && <ContentTab />}
          </div>
        </main>
      )}
    </>
  );
}
