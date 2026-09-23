import { useEffect } from "react";
import { PortfolioContext, usePortfolioState } from "../../hooks/usePortfolio";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Hero } from "../../components/sections/Hero";
import { About } from "../../components/sections/about/About";
import { Specialties } from "../../components/sections/Specialties";
import { Portfolio } from "../../components/sections/portfolio/Portfolio";
import { Resume } from "../../components/sections/resume/Resume";
import { Certificates } from "../../components/sections/Certificates";
import { Contact } from "../../components/sections/contact/Contact";
import { loadWidget } from "../../i18n/googleTranslate";

export function App() {
  const state = usePortfolioState();

  // Loaded only once the portfolio data has actually rendered — Google
  // walks and rewrites live text nodes, so starting it while React is
  // still mounting the "ready" content races the two DOM writers
  // against each other (see googleTranslateDomGuard.ts's docblock for
  // the crash this used to cause).
  useEffect(() => {
    if (state.status === "ready") loadWidget();
  }, [state.status]);

  return (
    <PortfolioContext.Provider value={state}>
      {/* Lets keyboard users jump past the nav straight to the content;
          only becomes visible on focus (see .skip-link in styles.css). */}
      <a href="#main" className="skip-link">
        İçeriğe geç
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        {state.status === "loading" && (
          <div className="state-screen">
            <div className="state-screen-card">Yükleniyor...</div>
          </div>
        )}

        {state.status === "error" && (
          <div className="state-screen">
            <div className="state-screen-card" role="alert">
              Veri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
            </div>
          </div>
        )}

        {state.status === "ready" && (
          <>
            <Hero />
            <About />
            <Specialties />
            <Portfolio />
            <Resume />
            <Certificates />
            <Contact />
          </>
        )}
      </main>

      {state.status === "ready" && <Footer />}
    </PortfolioContext.Provider>
  );
}
