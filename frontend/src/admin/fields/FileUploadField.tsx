import { useState, type ChangeEvent } from "react";
import { uploadImage } from "../../lib/adminApi";

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (path: string) => void;
  onUploaded?: (path: string, file: File) => void;
}

/** Single-file upload — same 30s timeout + Turkish error messages as the legacy admin.js. */
export function FileUploadField({ label, value, onChange, onUploaded }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const original = value;
    setUploading(true);
    onChange("Yükleniyor...");

    try {
      const url = await uploadImage(file);
      onChange(url);
      onUploaded?.(url, file);
    } catch (err) {
      const timedOut = err instanceof Error && err.name === "AbortError";
      alert(timedOut ? "Yükleme zaman aşımına uğradı. Lütfen tekrar deneyin." : "Görsel yüklenemedi: " + (err instanceof Error ? err.message : String(err)));
      onChange(original);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="file-upload-container">
        <label className="custom-file-upload-btn btn btn-secondary btn-sm">
          Dosya Seç
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleChange} disabled={uploading} />
        </label>
        <span className="file-upload-display">{value || "Dosya seçilmedi"}</span>
      </div>
    </div>
  );
}
