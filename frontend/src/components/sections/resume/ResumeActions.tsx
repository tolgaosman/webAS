import { usePortfolio } from "../../../hooks/usePortfolio";
import { useDict, useT } from "../../../i18n/useTranslation";
import { sanitizeUrl } from "../../../lib/sanitize";

export function ResumeActions() {
  const { personal } = usePortfolio();
  const t = useT();
  const dict = useDict();

  const rawCvUrl = t(personal.cvUrl) || "alaraCV.pdf";
  const cvUrl = sanitizeUrl(rawCvUrl) || "/alaraCV.pdf";
  const downloadName = rawCvUrl.split("/").pop() || "Alara_Soysan_CV.pdf";

  return (
    <div className="resume-actions-group">
      <a href={cvUrl} target="_blank" rel="noopener" className="btn btn-secondary">
        <span>{dict.resume.openResume}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
      <a href={cvUrl} download={downloadName} className="btn btn-primary">
        <span>{dict.resume.downloadResume}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </a>
    </div>
  );
}
