import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles.css";
import "../../styles/lang-selector.css";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>
);
