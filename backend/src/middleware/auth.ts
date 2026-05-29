// ===================================================================
// JWT Authentication Middleware
// Validates HTTP-Only cookie tokens. No localStorage token storage.
// ===================================================================

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  uid: string;
  email: string;
  role: string;
}

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Middleware that verifies the JWT from HTTP-Only cookie.
 * Rejects requests without a valid token.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.auth_token;

  if (!token) {
    res.status(401).json({ error: "Oturum bulunamadı. Lütfen giriş yapın." });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("FATAL: JWT_SECRET is not configured");
      res.status(500).json({ error: "Sunucu yapılandırma hatası." });
      return;
    }

    const decoded = jwt.verify(token, secret) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Oturum süresi doldu. Tekrar giriş yapın." });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Geçersiz oturum. Tekrar giriş yapın." });
      return;
    }
    res.status(401).json({ error: "Yetkilendirme hatası." });
  }
}

/**
 * Generate a signed JWT token.
 */
export function generateToken(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Set the JWT as an HTTP-Only secure cookie.
 */
export function setAuthCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("auth_token", token, {
    httpOnly: true, // JavaScript cannot access this cookie (XSS-safe)
    secure: isProduction, // Only HTTPS in production
    sameSite: isProduction ? "none" : "lax", // Cross-site for GitHub Pages ↔ Render
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

/**
 * Clear the auth cookie (logout).
 */
export function clearAuthCookie(res: Response): void {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
}
