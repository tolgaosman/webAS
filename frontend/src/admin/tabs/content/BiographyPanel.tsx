import { useState } from "react";
import { useCrudResource } from "../../store/useCrudResource";
import { LocaleTabsProvider } from "../../fields/LocaleTabs";
import { TranslatableTextarea } from "../../fields/TranslatableTextarea";
import { emptyLocalized } from "../../../i18n/resolve";
import type { BioParagraph } from "../../../types/content";
import type { LocalizedString } from "../../../i18n/types";

function ParagraphRow({ item, onSave, onDelete }: { item: BioParagraph; onSave: (body: LocalizedString) => void; onDelete: () => void }) {
  const [body, setBody] = useState(item.body);
  const dirty = body.tr !== item.body.tr || body.en !== item.body.en || body.nl !== item.body.nl;

  return (
    <div className="inline-form" style={{ flexDirection: "column", alignItems: "stretch" }}>
      <TranslatableTextarea label="Paragraph" value={body} onChange={setBody} rows={3} fullWidth />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        <button className="btn btn-primary btn-sm" disabled={!dirty} onClick={() => onSave(body)}>
          Save
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export function BiographyPanel() {
  const { items, loading, create, update, remove } = useCrudResource<BioParagraph>("bio-paragraphs");

  return (
    <div className="sub-tab-content active" id="sub-bio">
      <div className="admin-info-box">
        <p>The 4 biography paragraphs shown in the "Hakkımda" section, in order.</p>
      </div>

      {loading && <p>Yükleniyor...</p>}

      <LocaleTabsProvider>
        {items.map((p) => (
          <ParagraphRow key={p.id} item={p} onSave={(body) => update(p.id, { body })} onDelete={() => remove(p.id)} />
        ))}

        <button className="btn btn-primary" onClick={() => create({ body: emptyLocalized() })}>
          Add Paragraph
        </button>
      </LocaleTabsProvider>
    </div>
  );
}
