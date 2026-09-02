import { sanitizeImgSrc } from "./sanitize";

/**
 * Normalizes a stored image path ("assets/images/x.png") to a
 * root-absolute URL ("/assets/images/x.png") and sanitizes it. Absolute
 * http(s)/data/blob URLs pass through unchanged.
 */
export function assetUrl(path: string | undefined | null): string {
  const safe = sanitizeImgSrc(path ?? "");
  if (!safe) return "";
  if (safe.startsWith("/") || /^[a-z]+:/i.test(safe)) return safe;
  return "/" + safe;
}
