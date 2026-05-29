// ===================================================================
// Rate Limiter Middleware — Brute-Force & DDoS Protection
// Different limits for auth endpoints vs general API.
// ===================================================================

import rateLimit from "express-rate-limit";

/**
 * Strict limiter for authentication endpoints.
 * 5 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.",
    retryAfter: "15 minutes",
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For for proxied requests (Render), fallback to IP
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown"
    );
  },
});

/**
 * Moderate limiter for API data endpoints.
 * 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "API istek limiti aşıldı. Lütfen biraz bekleyin.",
    retryAfter: "15 minutes",
  },
  keyGenerator: (req) => {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown"
    );
  },
});

/**
 * Global limiter for all requests.
 * 300 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Çok fazla istek gönderildi. Lütfen bekleyin.",
  },
  keyGenerator: (req) => {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown"
    );
  },
});

/**
 * Password reset limiter.
 * 3 requests per 30 minutes per IP.
 */
export const resetLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Çok fazla şifre sıfırlama isteği. Lütfen 30 dakika sonra tekrar deneyin.",
  },
  keyGenerator: (req) => {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown"
    );
  },
});
