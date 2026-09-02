import type { LocalizedString } from "../i18n/types";

// Content that used to be hardcoded in the legacy index.html and now
// lives in the database (see migration plan §Faz 2/4 and
// backend/database/seeders/StaticContentSeeder.php).

export interface BioParagraph {
  id: number;
  body: LocalizedString;
}

export interface Hobby {
  id: number;
  icon: string;
  label: LocalizedString;
}

export interface Specialty {
  id: number;
  image: string;
  title: LocalizedString;
  desc: LocalizedString;
  ctaLabel: LocalizedString;
  ctaHref: string;
}

/** Keyed by dotted key, e.g. "section.about.tag" — see ContentBlockController. */
export type ContentBlockMap = Record<string, LocalizedString>;
