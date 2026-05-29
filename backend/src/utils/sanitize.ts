// ===================================================================
// HTML Sanitization Utilities
// Strips dangerous HTML/JS from user input to prevent Stored XSS.
// ===================================================================

/**
 * Strip all HTML tags from a string. Use for plain-text fields.
 */
export function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/**
 * Escape HTML special characters to prevent XSS injection.
 * Use when you need to preserve the text but make it safe for HTML rendering.
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#96;",
  };
  return input.replace(/[&<>"'/`]/g, (char) => map[char] || char);
}

/**
 * Sanitize an object recursively — escape all string values.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === "string") {
    return escapeHtml(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized as T;
  }
  return obj;
}

/**
 * Validate that a string doesn't contain common injection patterns.
 * Returns true if the input looks safe.
 */
export function isSafeInput(input: string): boolean {
  const dangerousPatterns = [
    /<script\b/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /data:\s*text\/html/i,
    /vbscript:/i,
    /expression\s*\(/i,
    /url\s*\(/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(input));
}
