// ===================================================================
// URL sanitizers carried over from the legacy sanitize.js (§Faz 5-7).
// escapeHtml() is deliberately NOT ported — React escapes all text
// content automatically, and the legacy hidden-DOM pattern that needed
// manual escaping (.portfolio-hidden-data, read back via .innerHTML) is
// gone entirely now that PortfolioModal takes its data as props/state.
// ===================================================================

/**
 * Sanitize a URL to prevent javascript: protocol XSS.
 * Only allows http:, https:, mailto:, tel:, and relative URLs.
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();

  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return trimmed;
  }

  const safeProtocols = ["http:", "https:", "mailto:", "tel:"];
  try {
    const parsed = new URL(trimmed);
    if (safeProtocols.includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    // Not a valid absolute URL — might be a relative path like "alaraCV.pdf".
    if (/^[a-zA-Z0-9]/.test(trimmed) && !trimmed.includes(":")) {
      return trimmed;
    }
  }

  return ""; // Block everything else (javascript:, data:, vbscript:, etc.)
}

/**
 * Sanitize an image src — allows data: URIs for base64 images,
 * http/https URLs, and relative paths.
 */
export function sanitizeImgSrc(src: unknown): string {
  if (typeof src !== "string") return "";
  const trimmed = src.trim();

  if (trimmed.startsWith("data:image/")) return trimmed;
  if (trimmed.startsWith("blob:")) return trimmed;
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;

  if (/^[a-zA-Z0-9./_-]/.test(trimmed) && !trimmed.includes(":")) {
    return trimmed;
  }

  return "";
}
