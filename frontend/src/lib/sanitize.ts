// ===================================================================
// Frontend HTML Sanitization Utility
// Prevents Stored XSS by escaping dangerous characters before
// injecting data into the DOM via innerHTML.
// ===================================================================

/**
 * Escape HTML special characters to prevent XSS injection.
 * Use this for any user-controlled data inserted via innerHTML.
 */
export function escapeHtml(str: unknown): string {
  if (typeof str !== "string") return String(str ?? "");
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#96;",
  };
  return str.replace(/[&<>"'/`]/g, (char) => map[char] || char);
}

/**
 * Alias for escapeHtml — shorter name for template literals.
 */
export const esc = escapeHtml;

/**
 * Sanitize a URL to prevent javascript: protocol XSS.
 * Only allows http:, https:, mailto:, tel:, and relative URLs.
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();

  // Allow relative URLs
  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return trimmed;
  }

  // Allow safe protocols only
  const safeProtocols = ["http:", "https:", "mailto:", "tel:"];
  try {
    const parsed = new URL(trimmed);
    if (safeProtocols.includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    // Not a valid URL — might be a relative path like "alaraCV.pdf"
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

  // Allow data: images (base64 placeholders)
  if (trimmed.startsWith("data:image/")) return trimmed;

  // Allow blob: for local previews
  if (trimmed.startsWith("blob:")) return trimmed;

  // Allow https/http
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;

  // Allow relative paths (no protocol injection)
  if (/^[a-zA-Z0-9./_-]/.test(trimmed) && !trimmed.includes(":")) {
    return trimmed;
  }

  return "";
}
