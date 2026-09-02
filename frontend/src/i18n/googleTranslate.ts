import type { Locale } from "./types";

/**
 * Google Translate integration (restored — see git history at 92f9bca^
 * for the original inline-script version this is ported from). The
 * hand-rolled {tr,en,nl} dictionary/DB system introduced in the React
 * rewrite is kept for UI chrome (src/i18n/dictionaries) but is NOT used
 * to translate database content anymore, because that content's en/nl
 * columns are empty — Google Translate is what actually changes the
 * visible language now, exactly like before the rewrite.
 *
 * Mechanism, unchanged from legacy: a `googtrans=/tr/<lang>` cookie
 * tells Google's widget which language to render on load; switching
 * language writes the cookie and reloads the page (no client-side
 * re-render — Google needs a fresh DOM pass to translate text nodes).
 */

const COOKIE_NAME = "googtrans";
const SOURCE_LANG = "tr";
const SUPPORTED: readonly Locale[] = ["tr", "en", "nl"];

function currentHost(): string {
  return typeof window === "undefined" ? "" : window.location.hostname;
}

/** Read the active language from the googtrans cookie. Defaults to "tr" if absent/malformed. */
export function readGoogTrans(): Locale {
  if (typeof document === "undefined") return SOURCE_LANG;
  const match = document.cookie.split(";").find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
  if (!match) return SOURCE_LANG;
  const value = match.trim().split("/").pop()?.trim();
  return (SUPPORTED as readonly string[]).includes(value ?? "") ? (value as Locale) : SOURCE_LANG;
}

/** Set the googtrans cookie on every relevant domain/path variant (legacy did all three so it works locally and in prod). */
export function setGoogTrans(locale: Locale): void {
  const value = `/${SOURCE_LANG}/${locale}`;
  const host = currentHost();
  document.cookie = `${COOKIE_NAME}=${value}; path=/`;
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=${host}`;
    document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=.${host}`;
  }
}

/** Delete the googtrans cookie (all variants) — restores the original Turkish DOM on reload. */
export function clearGoogTrans(): void {
  const host = currentHost();
  const expired = "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  document.cookie = `${COOKIE_NAME}=${expired}`;
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    document.cookie = `${COOKIE_NAME}=${expired}; domain=${host}`;
    document.cookie = `${COOKIE_NAME}=${expired}; domain=.${host}`;
  }
}

/**
 * Writes the default-language cookie the FIRST time a visitor arrives
 * (no googtrans cookie yet) — the site's source content is Turkish, but
 * the requested default is English, so a first-time visitor should see
 * `/tr/en` rather than no translation at all. Must run before
 * loadWidget()/element.js so Google picks it up on its very first pass.
 * A returning visitor's own cookie (including an explicit "tr", i.e.
 * "show me the original") is left untouched.
 */
export function ensureDefaultLocale(): void {
  if (typeof document === "undefined") return;
  const hasCookie = document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
  if (!hasCookie) setGoogTrans("en");
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate: { TranslateElement: new (opts: Record<string, unknown>, el: string) => void } };
  }
}

let widgetLoaded = false;

/**
 * Injects the hidden Google Translate widget + its script tag. Idempotent
 * — safe to call more than once (e.g. React StrictMode's double-invoke).
 * Call this AFTER the app's own data has rendered (see App.tsx), not
 * before: Google walks and rewrites live text nodes, and doing that
 * while React is still mounting its initial content races the two
 * DOM writers against each other.
 */
export function loadWidget(): void {
  if (widgetLoaded || typeof document === "undefined") return;
  widgetLoaded = true;

  const container = document.createElement("div");
  container.id = "google_translate_element";
  container.style.display = "none";
  document.body.appendChild(container);

  window.googleTranslateElementInit = () => {
    new window.google!.translate.TranslateElement(
      {
        pageLanguage: SOURCE_LANG,
        includedLanguages: "en,tr,nl",
        autoDisplay: false,
        gaTrack: false,
      },
      "google_translate_element"
    );
    hideBanner();
  };

  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.body.appendChild(script);
}

/** Aggressively hides Google's top banner iframe, including ones it inserts asynchronously after init. */
function hideBanner(): void {
  const hide = () => {
    document.querySelectorAll('.goog-te-banner-frame, .skiptranslate.goog-te-banner-frame, [class*="goog-te-banner"]').forEach((el) => {
      (el as HTMLElement).style.setProperty("display", "none", "important");
    });
    document.body.style.setProperty("top", "0px", "important");
    document.body.style.setProperty("margin-top", "0px", "important");
  };

  hide();
  const observer = new MutationObserver(hide);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
}
