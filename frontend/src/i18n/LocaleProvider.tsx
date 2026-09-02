import { createContext, useMemo, type ReactNode } from "react";
import type { Locale, UiDict } from "./types";
import tr from "./dictionaries/tr";

export interface LocaleContextValue {
  locale: Locale;
  /**
   * No-op — kept only so existing `useLocale()` callers don't need a
   * type change. Language switching is Google Translate's job now (see
   * src/i18n/googleTranslate.ts), which needs a full page reload to
   * re-walk the DOM; there is nothing left for a React state update to
   * drive. src/components/layout/LangSelector.tsx calls
   * setGoogTrans()+reload directly instead of this.
   */
  setLocale: (locale: Locale) => void;
  dict: UiDict;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * The site's source content — both the database ({tr,en,nl} fields,
 * only `tr` is actually filled in) and this UI dictionary — is Turkish.
 * Google Translate (loaded in entries/public/App.tsx) rewrites the
 * rendered DOM in place for en/nl; React itself always renders the `tr`
 * strings, unconditionally. This used to be a stateful, user-switchable
 * locale (§Faz 5-7's own from-scratch i18n system) — restored to a
 * fixed source language because Google Translate replaced it (see git
 * history at 92f9bca^ for the pre-rewrite Google Translate version this
 * undoes the removal of).
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const value = useMemo<LocaleContextValue>(
    () => ({ locale: "tr", setLocale: () => {}, dict: tr }),
    []
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
