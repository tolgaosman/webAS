// ===================================================================
// Backend API client — single place that knows about every endpoint
// path, method, and payload shape. Endpoints are unchanged from the
// legacy Express backend (see legacy/backend/src/routes/*.ts) and,
// after the Laravel migration, must keep returning byte-compatible
// responses (see migration plan §Faz 4).
// ===================================================================

import type { PortfolioData } from "../types/portfolio";

interface ErrorBody {
  error?: string;
}

/** GET /api/portfolio — throws on network failure OR non-2xx status. */
export async function fetchPortfolioFromApi(): Promise<PortfolioData> {
  const res = await fetch("/api/portfolio");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<PortfolioData>;
}

/**
 * GET /portfolio-data.json — the static fallback copy shipped alongside
 * the site. Always an absolute path (see migration plan §Faz 10: the
 * legacy app.js used a relative path and admin.js an absolute one;
 * unified here to the absolute form so behavior no longer depends on
 * which page served the request).
 */
export async function fetchPortfolioStatic(): Promise<PortfolioData> {
  const res = await fetch("/portfolio-data.json");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<PortfolioData>;
}

/** GET /api/auth/me — resolves true iff a valid session cookie is present. */
export async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    return res.ok;
  } catch {
    return false;
  }
}

/** POST /api/auth/login — throws with the server's Turkish error message on failure. */
export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data: ErrorBody = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Giriş başarısız.");
}

/** POST /api/auth/logout — best-effort, caller decides how to handle failure. */
export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

/** Thrown by updatePortfolio() when the session has expired (HTTP 401). */
export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

/** PUT /api/portfolio — replaces the whole object, mirrors the legacy admin.js saveData() network call. */
export async function updatePortfolio(data: PortfolioData): Promise<void> {
  const res = await fetch("/api/portfolio", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (res.status === 401) throw new UnauthorizedError();

  if (!res.ok) {
    const body: ErrorBody = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
}

/**
 * POST /api/portfolio/upload-image — single-file upload with the same
 * 30s client-side timeout as the legacy admin.js. Throws a DOMException
 * named "AbortError" on timeout so callers can distinguish it from other
 * failures, matching the legacy err.name === "AbortError" check.
 */
export async function uploadImage(file: File, prefix: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("prefix", prefix);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch("/api/portfolio/upload-image", {
      method: "POST",
      credentials: "include",
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      const err: ErrorBody = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const body = (await res.json()) as { url: string };
    return body.url;
  } finally {
    clearTimeout(timeoutId);
  }
}
