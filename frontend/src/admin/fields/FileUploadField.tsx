import { useState, type ChangeEvent } from "react";
import { uploadImage, uploadDocument } from "../../lib/adminApi";
import { toastError } from "../../lib/toast";

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (path: string) => void;
  onUploaded?: (path: string, file: File) => void;
  /** "image" (default) restricts to jpeg/png/webp/gif; "document" accepts PDF/Word CVs — see PortfolioController::uploadDocument. */
  kind?: "image" | "document";
}

const ACCEPT = {
  image: "image/jpeg,image/png,image/webp,image/gif",
  document: "application/pdf,.pdf,.doc,.docx",
};

/** Single-file upload — same 30s timeout + Turkish error messages as the legacy admin.js. */
export function FileUploadField({ label, value, onChange, onUploaded, kind = "image" }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const upload = kind === "document" ? uploadDocument : uploadImage;
  const failureLabel = kind === "document" ? "Dosya yüklenemedi: " : "Görsel yüklenemedi: ";

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const original = value;
    setUploading(true);
    onChange("Yükleniyor...");

    try {
      const url = await upload(file);
      onChange(url);
      onUploaded?.(url, file);
    } catch (err) {
      const timedOut = err instanceof Error && err.name === "AbortError";
      toastError(timedOut ? "Yükleme zaman aşımına uğradı. Lütfen tekrar deneyin." : failureLabel + (err instanceof Error ? err.message : String(err)));
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
          <input type="file" accept={ACCEPT[kind]} onChange={handleChange} disabled={uploading} />
        </label>
        <span className="file-upload-display">{value || "Dosya seçilmedi"}</span>
      </div>
    </div>
  );
}
