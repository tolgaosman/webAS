import { LOCALES } from "../../i18n/types";
import type { LocalizedString } from "../../i18n/types";
import { usePanelLocale } from "./LocaleTabs";

interface TranslatableFieldProps {
  label: string;
  value: LocalizedString;
  onChange: (next: LocalizedString) => void;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
}

/**
 * The reusable core of every translatable field in the admin panel
 * (§Faz 5-7) — renders inside the same `.form-group` every other admin
 * input uses, so it inherits admin.css's input styling unchanged. The
 * TR tab is implicitly required (TranslatedText::get() falls back to
 * it); EN/NL show a dot when empty via `.i18n-tab.empty`.
 */
export function TranslatableInput({ label, value, onChange, required, maxLength, placeholder }: TranslatableFieldProps) {
  const { active, setActive } = usePanelLocale();

  return (
    <div className="form-group i18n-field">
      <label>
        {label}
        {required && active === "tr" ? " *" : ""}
      </label>
      <div className="i18n-tabs">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            className={`i18n-tab${l === active ? " active" : ""}${!value[l] ? " empty" : ""}`}
            onClick={() => setActive(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={value[active]}
        maxLength={maxLength}
        placeholder={active === "tr" ? placeholder : `(${placeholder ?? ""} — boşsa Türkçeye düşer)`}
        required={required && active === "tr"}
        onChange={(e) => onChange({ ...value, [active]: e.target.value })}
      />
    </div>
  );
}
