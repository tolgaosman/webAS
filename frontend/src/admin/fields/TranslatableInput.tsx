import type { LocalizedString } from "../../i18n/types";

interface TranslatableFieldProps {
  label: string;
  value: LocalizedString;
  onChange: (next: LocalizedString) => void;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
}

/**
 * A single-language input for a {tr,en,nl} field. The admin types once
 * and the backend auto-translates into the other two locales on save
 * (see App\Casts\Translatable::set() / App\Services\AutoTranslator) —
 * no more TR/EN/NL tabs to type the same content into three times.
 *
 * Always reads/writes the `tr` slot: it's the site's source-of-truth
 * fallback (TranslatedText::get()), so after a save the box reflects
 * the Turkish result regardless of what language was actually typed.
 */
export function TranslatableInput({ label, value, onChange, required, maxLength, placeholder }: TranslatableFieldProps) {
  return (
    <div className="form-group i18n-field">
      <label>{label}</label>
      <input
        type="text"
        value={value.tr}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange({ ...value, tr: e.target.value })}
      />
      <span className="form-group-hint">Herhangi bir dilde yazın — kaydedince diğer diller otomatik çevrilir.</span>
    </div>
  );
}
