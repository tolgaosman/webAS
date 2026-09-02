// ===================================================================
// Admin API client (§Faz 3/5-7). Auth contract is byte-compatible with
// legacy (HttpOnly auth_token cookie, credentials:"include" on every
// call). CRUD calls hit the new per-resource REST endpoints under
// /api/admin/* — see backend/routes/api.php.
// ===================================================================

import { toCamel, toSnake } from "./caseMap";

interface ErrorBody {
  error?: string;
  details?: { field: string; message: string }[];
}

export class ApiError extends Error {
  details?: { field: string; message: string }[];
  status: number;

  constructor(message: string, status: number, details?: ErrorBody["details"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function parseErrorOrThrow(res: Response): Promise<never> {
  const body: ErrorBody = await res.json().catch(() => ({}));
  throw new ApiError(body.error || `HTTP ${res.status}`, res.status, body.details);
}

/**
 * The backend's validation-failure shape carries a generic top-level
 * message plus a {field, message} list (see bootstrap/app.php's
 * ValidationException renderer) — without this, every 400 alert reads
 * "Doğrulama hatası. Lütfen girişlerinizi kontrol edin." with no way to
 * tell which field actually failed.
 */
export function formatApiError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.details?.length) {
      const detail = err.details.map((d) => `${d.field}: ${d.message}`).join("; ");
      return `${err.message} (${detail})`;
    }
    return err.message;
  }
  return String(err);
}

// ── Auth ─────────────────────────────────────────────────────────

export async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) await parseErrorOrThrow(res);
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

// ── Generic resource CRUD ───────────────────────────────────────

const BASE = "/api/admin";

export async function listResource<T>(resource: string): Promise<T[]> {
  const res = await fetch(`${BASE}/${resource}`, { credentials: "include" });
  if (!res.ok) await parseErrorOrThrow(res);
  const body = await res.json();
  return toCamel(body.data) as T[];
}

export async function createResource<T>(resource: string, payload: unknown): Promise<T> {
  const res = await fetch(`${BASE}/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(toSnake(payload)),
  });
  if (!res.ok) await parseErrorOrThrow(res);
  const body = await res.json();
  return toCamel(body.data) as T;
}

export async function updateResource<T>(resource: string, id: number, payload: unknown): Promise<T> {
  const res = await fetch(`${BASE}/${resource}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(toSnake(payload)),
  });
  if (!res.ok) await parseErrorOrThrow(res);
  const body = await res.json();
  return toCamel(body.data) as T;
}

export async function deleteResource(resource: string, id: number): Promise<void> {
  const res = await fetch(`${BASE}/${resource}/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) await parseErrorOrThrow(res);
}

export async function reorderResource(resource: string, ids: number[]): Promise<void> {
  const res = await fetch(`${BASE}/${resource}/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) await parseErrorOrThrow(res);
}

// ── Personal (singleton) ────────────────────────────────────────

export async function getPersonal<T>(): Promise<T> {
  const res = await fetch(`${BASE}/personal`, { credentials: "include" });
  if (!res.ok) await parseErrorOrThrow(res);
  const body = await res.json();
  return toCamel(body.data) as T;
}

export async function updatePersonal<T>(payload: unknown): Promise<T> {
  const res = await fetch(`${BASE}/personal`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(toSnake(payload)),
  });
  if (!res.ok) await parseErrorOrThrow(res);
  const body = await res.json();
  return toCamel(body.data) as T;
}

// ── Content blocks (bulk map) ───────────────────────────────────

export async function getContentBlocks<T>(): Promise<T> {
  const res = await fetch(`${BASE}/content-blocks`, { credentials: "include" });
  if (!res.ok) await parseErrorOrThrow(res);
  return res.json() as Promise<T>;
}

export async function updateContentBlocks(blocks: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${BASE}/content-blocks`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ blocks }),
  });
  if (!res.ok) await parseErrorOrThrow(res);
}

// ── Upload ───────────────────────────────────────────────────────

/**
 * Same 30s timeout + error handling as the legacy admin.js. Throws with
 * `.name === "AbortError"` on timeout so callers can show the specific
 * Turkish timeout message.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch("/api/portfolio/upload-image", {
      method: "POST",
      credentials: "include",
      body: formData,
      signal: controller.signal,
    });
    if (!res.ok) await parseErrorOrThrow(res);
    const body = (await res.json()) as { url: string };
    return body.url;
  } finally {
    clearTimeout(timeoutId);
  }
}
