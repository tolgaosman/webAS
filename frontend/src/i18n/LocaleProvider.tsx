import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { LOCALES, type Locale, type UiDict } from "./types";
import tr from "./dictionaries/tr";
import en from "./dictionaries/en";
import nl from "./dictionaries/nl";

const DICTIONARIES: Record<Locale, UiDict> = { tr, en, nl };
const STORAGE_KEY = "locale";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: UiDict;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "tr";

  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  if (fromQuery && (LOCALES as readonly string[]).includes(fromQuery)) {
    return fromQuery as Locale;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LOCALES as readonly string[]).includes(stored)) {
      return stored as Locale;
    }
  } catch {
    // localStorage can throw in private-browsing contexts — fall through.
  }

  const browserLang = window.navigator.language?.slice(0, 2);
  if (browserLang && (LOCALES as readonly string[]).includes(browserLang)) {
    return browserLang as Locale;
  }

  return "tr";
}

/**
 * Replaces the legacy Google Translate widget entirely (§Faz 5-7).
 * Locale changes are a pure state update — no reload, no network
 * request — persisted to localStorage and mirrored to the URL
 * (`?lang=`) via history.replaceState so a link can be shared in a
 * specific language without this becoming real client-side routing.
 *
 * Also sets `document.documentElement.lang`, which is what keeps
 * styles.css's `html[lang="nl"]` rules (hero title shrink, etc. —
 * §Faz 8, "risks and traps") working unchanged.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — persistence is a convenience, not a requirement
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(null, "", url);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, dict: DICTIONARIES[locale] }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
