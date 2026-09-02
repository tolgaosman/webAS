import { useContext } from "react";
import { LocaleContext } from "./LocaleProvider";
import { resolve } from "./resolve";
import type { LocalizedString, Locale, UiDict } from "./types";

function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation()/useLocale() must be used inside <LocaleProvider>");
  }
  return ctx;
}

/** Returns a resolver for database {tr,en,nl} content: t(project.title). */
export function useT(): (value: LocalizedString | undefined | null) => string {
  const { locale } = useLocaleContext();
  return (value) => resolve(value, locale);
}

/** Returns the static UI dictionary for the active locale. */
export function useDict(): UiDict {
  return useLocaleContext().dict;
}

export function useLocale(): { locale: Locale; setLocale: (l: Locale) => void } {
  const { locale, setLocale } = useLocaleContext();
  return { locale, setLocale };
}
