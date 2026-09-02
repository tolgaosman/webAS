import { useRef, useState } from "react";
import { assetUrl } from "../../lib/assetUrl";

interface CarouselThumbStripProps {
  paths: string[];
  onChange: (next: string[]) => void;
}

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";

/**
 * Drag-to-reorder image thumbnail strip — same classes/drag events as
 * the legacy admin.js (`.carousel-thumb-item`, `.dragging`,
 * `.drag-over`, `.carousel-thumb-order`, `.carousel-thumb-remove`), but
 * driven by a `paths: string[]` prop instead of parsing a comma-joined
 * text input (§Faz 5-7 — the API now returns/accepts `images` as a
 * real array).
 */
export function CarouselThumbStrip({ paths, onChange }: CarouselThumbStripProps) {
  const dragSrcIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  if (paths.length === 0) return null;

  const remove = (idx: number) => {
    onChange(paths.filter((_, i) => i !== idx));
  };

  const reorder = (from: number, to: number) => {
    const next = [...paths];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="carousel-thumb-strip">
      {paths.map((src, idx) => (
        <div
          key={`${src}-${idx}`}
          className={`carousel-thumb-item${draggingIdx === idx ? " dragging" : ""}${dragOverIdx === idx ? " drag-over" : ""}`}
          draggable
          title="Sürükle ile sıralamayı değiştir"
          onDragStart={() => {
            dragSrcIdx.current = idx;
            setDraggingIdx(idx);
          }}
          onDragEnd={() => {
            setDraggingIdx(null);
            setDragOverIdx(null);
            dragSrcIdx.current = null;
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragSrcIdx.current === idx) return;
            setDragOverIdx(idx);
          }}
          onDragLeave={() => setDragOverIdx(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverIdx(null);
            if (dragSrcIdx.current === null || dragSrcIdx.current === idx) return;
            reorder(dragSrcIdx.current, idx);
          }}
        >
          <img
            src={assetUrl(src) || PLACEHOLDER_SVG}
            alt=""
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.objectFit = "contain";
              e.currentTarget.style.background = "var(--folder-bg, #2a2a3a)";
              e.currentTarget.style.padding = "8px";
              e.currentTarget.src = PLACEHOLDER_SVG;
            }}
          />
          <span className="carousel-thumb-order">{idx + 1}</span>
          <button
            type="button"
            className="carousel-thumb-remove"
            title="Kaldır"
            onClick={(e) => {
              e.stopPropagation();
              remove(idx);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
