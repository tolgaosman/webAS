import { useState } from "react";
import { Hamburger } from "./Hamburger";
import { NavMenu } from "./NavMenu";
import { LangSelector } from "./LangSelector";
import { useStickyHeader } from "../../hooks/useStickyHeader";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export function Header() {
  const { scrolled, navHidden } = useStickyHeader();
  const activeSection = useActiveSection();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${scrolled ? "scrolled " : ""}${navHidden ? "nav-hidden" : ""}`.trim()}>
      <div className="nav-container">
        <a href="#hero" className="logo" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/siteLogo.png"
            alt="Alara Soysan Logo"
            className="nav-logo-img"
            height={80}
            style={{ maxHeight: 80, width: "auto", display: "block" }}
          />
        </a>

        <Hamburger open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />

        <NavMenu
          open={menuOpen}
          activeSection={activeSection}
          isMobile={isMobile}
          onLinkClick={closeMenu}
        />

        <div className="nav-actions">
          {!isMobile && (
            <>
              <LangSelector />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
