export type Locale = "tr" | "en" | "nl";

export const LOCALES: readonly Locale[] = ["tr", "en", "nl"];

/** Mirrors backend/app/Support/TranslatedText.php's JSON shape exactly. */
export interface LocalizedString {
  tr: string;
  en: string;
  nl: string;
}

/**
 * Static, developer-owned UI chrome (nav labels, button text, form
 * labels, modal headings, error strings) — NOT stored in the database.
 * See migration plan §Faz 2 for the DB-vs-dictionary boundary. Every
 * key is required in all three locale dictionaries; a missing key is a
 * compile error (see src/i18n/dictionaries/*.ts).
 */
export interface UiDict {
  nav: {
    home: string;
    about: string;
    specialties: string;
    portfolio: string;
    resume: string;
    certificates: string;
    contact: string;
  };
  langNames: Record<Locale, string>;
  portfolio: {
    viewDetails: string;
    keyAchievements: string;
  };
  modal: {
    role: string;
    client: string;
    tools: string;
    focus: string;
    achievements: string;
    personalProject: string;
  };
  contact: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    validationAlert: string;
    emailChannelLabel: string;
    locationLabel: string;
    instagramLabel: string;
    linkedinLabel: string;
    /** Decorative polaroid-pile captions — never edited by Alara, so kept
     *  as UI chrome rather than a database field (see migration plan
     *  §Faz 5-7's DB-vs-dictionary boundary). */
    pile1Caption: string;
    pile2Caption: string;
  };
  resume: {
    openResume: string;
    downloadResume: string;
  };
}
