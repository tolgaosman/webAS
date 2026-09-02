import type { LocalizedString } from "../../i18n/types";

interface TranslatableTextareaProps {
  label: string;
  value: LocalizedString;
  onChange: (next: LocalizedString) => void;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  fullWidth?: boolean;
}

/** Textarea counterpart of TranslatableInput — see its docblock. */
export function TranslatableTextarea({ label, value, onChange, required, maxLength, rows = 4, fullWidth }: TranslatableTextareaProps) {
  return (
    <div className={`form-group i18n-field${fullWidth ? " full-width" : ""}`}>
      <label>{label}</label>
      <textarea
        value={value.tr}
        maxLength={maxLength}
        rows={rows}
        required={required}
        onChange={(e) => onChange({ ...value, tr: e.target.value })}
      />
      <span className="form-group-hint">Herhangi bir dilde yazın — kaydedince diğer diller otomatik çevrilir.</span>
    </div>
  );
}
