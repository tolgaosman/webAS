import { createContext, useContext, useState, type ReactNode } from "react";
import { LOCALES, type Locale } from "../../i18n/types";

const FieldLocaleContext = createContext<{ active: Locale; setActive: (l: Locale) => void } | null>(null);

/**
 * Wrap a form/editor in this once; every <TranslatableInput>/
 * <TranslatableTextarea> inside shares the same active locale, so
 * switching the tab once at the top of a form switches every field at
 * once (§Faz 5-7) instead of needing to click through TR/EN/NL on each
 * of ~40 fields individually.
 */
export function LocaleTabsProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Locale>("tr");
  return <FieldLocaleContext.Provider value={{ active, setActive }}>{children}</FieldLocaleContext.Provider>;
}

export function usePanelLocale() {
  const ctx = useContext(FieldLocaleContext);
  if (!ctx) throw new Error("usePanelLocale() must be used inside <LocaleTabsProvider>");
  return ctx;
}

/** A standalone tab switcher — one of these at the top of each admin form/editor. */
export function LocaleTabsSwitcher() {
  const { active, setActive } = usePanelLocale();
  return (
    <div className="i18n-tabs" style={{ marginBottom: "1rem" }}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={`i18n-tab${l === active ? " active" : ""}`}
          onClick={() => setActive(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
