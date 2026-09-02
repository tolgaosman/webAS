import type { Locale, LocalizedString } from "./types";

/**
 * Resolve a {tr,en,nl} value for the given locale, falling back to `tr`
 * when the requested locale is empty — mirrors
 * backend/app/Support/TranslatedText.php::get() exactly so the admin
 * preview and the public site can never disagree on what "empty"
 * displays as.
 */
export function resolve(value: LocalizedString | undefined | null, locale: Locale): string {
  if (!value) return "";
  const v = locale === "tr" ? value.tr : locale === "en" ? value.en : value.nl;
  return v !== "" ? v : value.tr;
}

/** A {tr,en,nl} object with every locale empty — the shape a brand-new field starts from. */
export function emptyLocalized(): LocalizedString {
  return { tr: "", en: "", nl: "" };
}
