import { useRef, useState } from "react";
import { useDict } from "../../i18n/useTranslation";
import { LOCALES, type Locale } from "../../i18n/types";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { readGoogTrans, setGoogTrans, clearGoogTrans } from "../../i18n/googleTranslate";

const FLAGS: Record<Locale, string> = {
  en: "https://flagcdn.com/w40/gb.png",
  tr: "https://flagcdn.com/w40/tr.png",
  nl: "https://flagcdn.com/w40/nl.png",
};

/**
 * Same markup/classes as before (.lang-selector/.lang-btn/.lang-dropdown/
 * .lang-option/.lang-flag-img, styled by src/styles/lang-selector.css),
 * but now drives Google Translate's cookie instead of the local i18n
 * state (see src/i18n/LocaleProvider.tsx's docblock for why: the DB
 * content this used to switch between was never actually translated,
 * so the real page-language switch is Google's again, as it was before
 * §Faz 5-7). Switching languages reloads the page — Google needs a
 * fresh DOM pass to translate, there's no way around that.
 *
 * `translate="no"`/`notranslate` on the root: without it, Google would
 * translate this control's own contents (the TR/EN/NL flag labels),
 * which looks broken once a language other than the current one is
 * selected.
 */
export function LangSelector({ onSelect }: { onSelect?: () => void }) {
  const dict = useDict();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);
  const active = readGoogTrans();

  useOnClickOutside(ref, () => setOpen(false));

  const choose = (l: Locale) => {
    setOpen(false);
    if (l === active) return;

    if (l === "tr") {
      clearGoogTrans();
    } else {
      setGoogTrans(l);
    }
    onSelect?.();
    window.location.reload();
  };

  return (
    <div className="lang-selector notranslate" translate="no" ref={ref}>
      <button
        className="lang-btn"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <img className="lang-btn-flag" src={FLAGS[active]} alt={active.toUpperCase()} />
        <span>{active.toUpperCase()}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div className={`lang-dropdown${open ? " open" : ""}`} role="listbox">
        {LOCALES.map((l) => (
          <div
            key={l}
            role="option"
            aria-selected={l === active}
            className={`lang-option${l === active ? " active" : ""}`}
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
