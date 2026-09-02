import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../styles.css";
import "../../styles/lang-selector.css";
import "../../styles/google-translate.css";
import { LocaleProvider } from "../../i18n/LocaleProvider";
import { ensureDefaultLocale } from "../../i18n/googleTranslate";
import { installGoogleTranslateDomGuard } from "../../lib/googleTranslateDomGuard";
import { initViewportScale } from "../../lib/viewportScale";
import { App } from "./App";

// All three must run before React (or Google's own script) touches the
// DOM: the cookie has to exist before element.js's first pass so a
// first-time visitor lands on English (see googleTranslate.ts's
// docblock), the guard has to be installed before Google gets a chance
// to wrap any text node React might later need to remove/reorder, and
// the viewport scale has to be set before first paint so there's no
// flash of unscaled layout.
ensureDefaultLocale();
installGoogleTranslateDomGuard();
initViewportScale();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>
);
