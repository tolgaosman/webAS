import { useState, type ChangeEvent } from "react";
import { uploadImage } from "../../lib/adminApi";
import { CarouselThumbStrip } from "./CarouselThumbStrip";

interface MultiFileUploadFieldProps {
  label: string;
  paths: string[];
  onChange: (next: string[]) => void;
}

/** Parallel multi-upload + drag-reorder thumb strip, matching the legacy admin.js flow. */
export function MultiFileUploadField({ label, paths, onChange }: MultiFileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    const results = await Promise.all(
      files.map((file) =>
        uploadImage(file).catch((err) => {
          console.error("Error uploading file", file.name, err);
          return null;
        })
      )
    );
    setUploading(false);

    const newUrls = results.filter((u): u is string => u !== null);
    if (newUrls.length === 0) {
      alert("Görseller yüklenemedi.");
      return;
    }
    onChange([...paths, ...newUrls]);
  };

  return (
    <div className="form-group full-width">
      <label>{label}</label>
      <div className="file-upload-container">
        <label className="custom-file-upload-btn btn btn-secondary btn-sm">
          Görsel Ekle
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleChange} disabled={uploading} />
        </label>
        <span className="file-upload-display">
          {uploading ? "Yükleniyor..." : `${paths.length} görsel`}
        </span>
        {paths.length > 0 && (
          <button type="button" className="btn btn-danger btn-sm" onClick={() => onChange([])}>
            Temizle
          </button>
        )}
      </div>
      <CarouselThumbStrip paths={paths} onChange={onChange} />
    </div>
  );
}
