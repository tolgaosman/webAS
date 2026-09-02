import { useEffect, useState } from "react";
import { getContentBlocks, updateContentBlocks, formatApiError } from "../../../lib/adminApi";
import { TranslatableInput } from "../../fields/TranslatableInput";
import type { LocalizedString } from "../../../i18n/types";

interface BlockEntry {
  group: string;
  kind: "line" | "rich";
  value: LocalizedString;
}

type BlockMap = Record<string, BlockEntry>;

export function SectionHeadingsPanel() {
  const [blocks, setBlocks] = useState<BlockMap | null>(null);
  const [dirty, setDirty] = useState<Record<string, LocalizedString>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getContentBlocks<BlockMap>().then(setBlocks).catch((e) => alert(formatApiError(e)));
  }, []);

  if (!blocks) return <p>Yükleniyor...</p>;

  const setValue = (key: string, value: LocalizedString) => {
    setDirty((d) => ({ ...d, [key]: value }));
  };

  const grouped = Object.entries(blocks).reduce<Record<string, [string, BlockEntry][]>>((acc, [key, entry]) => {
    (acc[entry.group] ??= []).push([key, entry]);
    return acc;
  }, {});

  const handleSaveAll = async () => {
    if (Object.keys(dirty).length === 0) return;
    setSaving(true);
    try {
      await updateContentBlocks(dirty);
      setBlocks((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        for (const [key, value] of Object.entries(dirty)) {
          next[key] = { ...next[key], value };
        }
        return next;
      });
      setDirty({});
      alert("Section headings updated.");
    } catch (err) {
      alert("Hata: " + formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sub-tab-content active" id="sub-content-blocks">
      <div className="admin-info-box">
        <p>Section tags, titles, and other short copy that appears across the site chrome.</p>
      </div>

      {Object.entries(grouped).map(([group, entries]) => (
        <div className="content-group" key={group}>
          <h4 className="content-group-title">{group}</h4>
          <div className="form-grid">
            {entries.map(([key, entry]) => (
              <TranslatableInput
                key={key}
                label={key}
                value={dirty[key] ?? entry.value}
                onChange={(v) => setValue(key, v)}
              />
            ))}
          </div>
        </div>
      ))}

      <button className="btn btn-primary" disabled={saving || Object.keys(dirty).length === 0} onClick={handleSaveAll}>
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
}
