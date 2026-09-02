import { useRef, useState } from "react";
import { useDict, useLocale } from "../../i18n/useTranslation";
import { LOCALES, type Locale } from "../../i18n/types";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const FLAGS: Record<Locale, string> = {
  en: "https://flagcdn.com/w40/gb.png",
  tr: "https://flagcdn.com/w40/tr.png",
  nl: "https://flagcdn.com/w40/nl.png",
};

/**
 * Replaces the legacy Google Translate dropdown entirely (§Faz 5-7) —
 * same markup/classes (.lang-selector/.lang-btn/.lang-dropdown/
 * .lang-option/.lang-flag-img, styled by src/styles/lang-selector.css,
 * lifted verbatim from the deleted inline <style> block), but a real
 * state change instead of a cookie + page reload.
 */
export function LangSelector({ onSelect }: { onSelect?: () => void }) {
  const { locale, setLocale } = useLocale();
  const dict = useDict();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  useOnClickOutside(ref, () => setOpen(false));

  const choose = (l: Locale) => {
    setLocale(l);
    setOpen(false);
    onSelect?.();
  };

  return (
    <div className="lang-selector" ref={ref}>
      <button
        className="lang-btn"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <img className="lang-btn-flag" src={FLAGS[locale]} alt={locale.toUpperCase()} />
        <span>{locale.toUpperCase()}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div className={`lang-dropdown${open ? " open" : ""}`} role="listbox">
        {LOCALES.map((l) => (
          <div
            key={l}
            role="option"
            aria-selected={l === locale}
            className={`lang-option${l === locale ? " active" : ""}`}
            onClick={() => choose(l)}
          >
            <img className="lang-flag-img" src={FLAGS[l]} alt={l.toUpperCase()} />
            <span>{dict.langNames[l]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
