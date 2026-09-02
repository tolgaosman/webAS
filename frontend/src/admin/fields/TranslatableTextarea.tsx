import { LOCALES } from "../../i18n/types";
import type { LocalizedString } from "../../i18n/types";
import { usePanelLocale } from "./LocaleTabs";

interface TranslatableTextareaProps {
  label: string;
  value: LocalizedString;
  onChange: (next: LocalizedString) => void;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  fullWidth?: boolean;
}

export function TranslatableTextarea({ label, value, onChange, required, maxLength, rows = 4, fullWidth }: TranslatableTextareaProps) {
  const { active, setActive } = usePanelLocale();

  return (
    <div className={`form-group i18n-field${fullWidth ? " full-width" : ""}`}>
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
      <textarea
        value={value[active]}
        maxLength={maxLength}
        rows={rows}
        required={required && active === "tr"}
        onChange={(e) => onChange({ ...value, [active]: e.target.value })}
      />
    </div>
  );
}
