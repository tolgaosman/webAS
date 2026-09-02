import { useEffect, useState } from "react";
import { getPersonal, updatePersonal, ApiError, formatApiError } from "../../lib/adminApi";
import { assetUrl } from "../../lib/assetUrl";
import { FileUploadField } from "../fields/FileUploadField";
import type { Personal } from "../../types/portfolio";

export function PersonalTab() {
  const [data, setData] = useState<Personal | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getPersonal<Personal>()
      .then(setData)
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : String(e)));
  }, []);

  if (loadError) {
    return (
      <section className="tab-content active" id="tab-personal">
        <div className="admin-info-box" role="alert">
          <p>Veri yüklenemedi: {loadError}</p>
        </div>
      </section>
    );
  }

  if (!data) return <p>Yükleniyor...</p>;

  const set = <K extends keyof Personal>(key: K, value: Personal[K]) => setData({ ...data, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updatePersonal<Personal>(data);
      setData(updated);
      alert("Personal details updated successfully!");
    } catch (err) {
      alert("Hata: " + formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="tab-content active" id="tab-personal">
      <form id="personal-form" className="admin-form" onSubmit={handleSubmit}>
        <div className="profile-upload-group">
          <div className="admin-polaroid-preview">
            <div className="admin-polaroid-img-box">
              <img id="p-img-preview" src={assetUrl(data.profileImage) || "/browserLogo.png"} alt="Profile Preview" />
            </div>
            <span className="admin-polaroid-label">Profile Pic</span>
          </div>
          <div className="profile-upload-fields">
            <FileUploadField label="Profile Image" value={data.profileImage} onChange={(v) => set("profileImage", v)} />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="p-name">Name</label>
            <input id="p-name" type="text" value={data.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="p-email">Email</label>
            <input id="p-email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="p-phone">Phone</label>
            <input id="p-phone" type="text" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="p-instagram">Instagram URL</label>
            <input id="p-instagram" type="text" value={data.instagram} onChange={(e) => set("instagram", e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="p-linkedin">LinkedIn URL</label>
            <input id="p-linkedin" type="text" value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="p-cv">CV Dosya Yolu</label>
            {/* No TR/EN/NL split here — the field writes the same value to
                all three locales at once (see PersonalController's
                TranslatableString rule, which still requires `tr` to be
                present). */}
            <input
              id="p-cv"
              type="text"
              value={data.cvUrl.tr}
              onChange={(e) => set("cvUrl", { tr: e.target.value, en: e.target.value, nl: e.target.value })}
              placeholder="alaraCV.pdf"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
