import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// IMPORT ORDER MATTERS (§Faz 5-7): admin.css's own `@import url('styles.css')`
// (line 2) pulls in the public stylesheet FIRST, so admin.css's own
// `.form-group`/`.form-grid` overrides land after it in the cascade —
// exactly the legacy behavior. styles.css must NEVER be imported
// separately here, or it would land after these overrides and quietly
// break every admin form's layout.
import "../../../admin.css";
import "../../styles/admin-i18n.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
