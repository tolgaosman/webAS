/** `.section-header-group` — the tag/title/divider triple at the top of every major section. */
export function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="section-header-group">
      <span className="section-tag">{tag}</span>
      <h2 className="section-title">{title}</h2>
      <div className="section-divider"></div>
    </div>
  );
}
