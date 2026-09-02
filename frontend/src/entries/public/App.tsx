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

export function App() {
  const state = usePortfolioState();

  return (
    <PortfolioContext.Provider value={state}>
      <Header />

      {state.status === "loading" && (
        <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
          Yükleniyor...
        </div>
      )}

      {state.status === "error" && (
        <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
          Veri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
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
          <Footer />
        </>
      )}
    </PortfolioContext.Provider>
  );
}
