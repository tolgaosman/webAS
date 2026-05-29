// ===================================================================
// Auth Controller — Login, Logout, Password Reset
// Firebase Auth happens server-side only. JWT issued as HTTP-Only cookie.
// ===================================================================

import { Request, Response } from "express";
import crypto from "crypto";
import { getAuth } from "../services/firebase";
import {
  generateToken,
  setAuthCookie,
  clearAuthCookie,
} from "../middleware/auth";
import {
  recordFailedLogin,
  clearFailedLogins,
  sendSecurityEvent,
} from "../services/alerting";

// In-memory password reset token store
// In production, use Redis or Firestore for persistence.
const resetTokens = new Map<
  string,
  { email: string; expiresAt: number; used: boolean }
>();

// Cleanup expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of resetTokens) {
    if (now > data.expiresAt || data.used) {
      resetTokens.delete(token);
    }
  }
}, 10 * 60 * 1000);

/**
 * POST /api/auth/login
 * Validates credentials via Firebase Auth, issues JWT as HTTP-Only cookie.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  try {
    // Verify the user exists in Firebase Auth
    const auth = getAuth();
    let userRecord;

    try {
      userRecord = await auth.getUserByEmail(email);
    } catch {
      // User not found — record as failed attempt
      recordFailedLogin(clientIp, email);
      res
        .status(401)
        .json({ error: "E-posta veya şifre hatalı." });
      return;
    }

    // Firebase Admin SDK cannot verify passwords directly.
    // We use a custom token + verification approach:
    // The admin panel only has one admin user. We verify the email matches
    // the configured admin email, then use Firebase Auth REST API to verify password.
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && email.toLowerCase() !== adminEmail.toLowerCase()) {
      recordFailedLogin(clientIp, email);
      res
        .status(401)
        .json({ error: "E-posta veya şifre hatalı." });
      return;
    }

    // Verify password using Firebase Auth REST API
    const firebaseApiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!firebaseApiKey) {
      console.error("FIREBASE_WEB_API_KEY not set — cannot verify password");
      res.status(500).json({ error: "Sunucu yapılandırma hatası." });
      return;
    }

    const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;
    const verifyResponse = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    if (!verifyResponse.ok) {
      recordFailedLogin(clientIp, email);
      res
        .status(401)
        .json({ error: "E-posta veya şifre hatalı." });
      return;
    }

    // Password verified! Generate JWT and set cookie.
    clearFailedLogins(clientIp);

    const token = generateToken({
      uid: userRecord.uid,
      email: userRecord.email || email,
      role: "admin",
    });

    setAuthCookie(res, token);

    await sendSecurityEvent(
      "Başarılı Giriş",
      `Admin girişi: ${email} (IP: ${clientIp})`,
      0x00ff00
    );

    res.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    recordFailedLogin(clientIp, email);
    res.status(500).json({ error: "Giriş işlemi başarısız." });
  }
}

/**
 * POST /api/auth/logout
 * Clears the auth cookie.
 */
export async function logout(_req: Request, res: Response): Promise<void> {
  clearAuthCookie(res);
  res.json({ success: true, message: "Çıkış yapıldı." });
}

/**
 * GET /api/auth/me
 * Returns the current authenticated user info from the JWT.
 */
export async function me(req: Request & { user?: any }, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Oturum bulunamadı." });
    return;
  }

  res.json({
    authenticated: true,
    user: {
      uid: req.user.uid,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

/**
 * POST /api/auth/request-reset
 * Generates a secure password reset token with 30-minute expiry.
 */
export async function requestPasswordReset(
  req: Request,
  res: Response
): Promise<void> {
  const { email } = req.body;

  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  try {
    // Always return success to prevent email enumeration attacks
    const auth = getAuth();

    try {
      await auth.getUserByEmail(email);
    } catch {
      // User doesn't exist, but we don't reveal that
      res.json({
        success: true,
        message:
          "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.",
      });
      return;
    }

    // Generate cryptographically secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiryMinutes = parseInt(
      process.env.RESET_TOKEN_EXPIRY_MINUTES || "30",
      10
    );
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;

    // Store token
    resetTokens.set(token, {
      email,
      expiresAt,
      used: false,
    });

    // In production, send this token via email using a service like SendGrid/Resend.
    // For now, we use Firebase Auth's built-in password reset.
    await auth.generatePasswordResetLink(email);

    await sendSecurityEvent(
      "Şifre Sıfırlama İsteği",
      `E-posta: ${email}, IP: ${clientIp}`,
      0xffa500
    );

    res.json({
      success: true,
      message:
        "Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.",
      // DEV ONLY — remove in production:
      ...(process.env.NODE_ENV !== "production" && {
        _devToken: token,
        _expiresAt: new Date(expiresAt).toISOString(),
      }),
    });
  } catch (err) {
    console.error("Password reset request error:", err);
    res.status(500).json({ error: "Şifre sıfırlama isteği başarısız." });
  }
}

/**
 * POST /api/auth/confirm-reset
 * Validates the reset token (must be within 30 minutes) and sets new password.
 */
export async function confirmPasswordReset(
  req: Request,
  res: Response
): Promise<void> {
  const { token, newPassword } = req.body;

  const tokenData = resetTokens.get(token);

  if (!tokenData) {
    res
      .status(400)
      .json({ error: "Geçersiz veya süresi dolmuş sıfırlama bağlantısı." });
    return;
  }

  // Check expiry (30 minutes)
  if (Date.now() > tokenData.expiresAt) {
    resetTokens.delete(token);
    res.status(400).json({
      error:
        "Şifre sıfırlama bağlantısının süresi dolmuş. Lütfen yeni bir istek oluşturun.",
    });
    return;
  }

  // Check if already used
  if (tokenData.used) {
    res
      .status(400)
      .json({ error: "Bu sıfırlama bağlantısı zaten kullanılmış." });
    return;
  }

  try {
    const auth = getAuth();
    const user = await auth.getUserByEmail(tokenData.email);

    // Update password
    await auth.updateUser(user.uid, { password: newPassword });

    // Mark token as used (one-time use)
    tokenData.used = true;

    await sendSecurityEvent(
      "Şifre Değiştirildi",
      `E-posta: ${tokenData.email}`,
      0xff6600
    );

    res.json({ success: true, message: "Şifreniz başarıyla güncellendi." });
  } catch (err) {
    console.error("Password reset confirm error:", err);
    res.status(500).json({ error: "Şifre güncelleme başarısız." });
  }
}
