import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  recordFailedLogin,
  clearFailedLogins,
  sendSecurityEvent,
} from "../services/alerting";

const JWT_EXPIRES_IN = "2h";
const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  try {
    // Check credentials against environment variables
    const adminEmail = process.env.ADMIN_EMAIL || "admin@alarasysn.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123"; // Fallback only, should be set in .env

    if (email !== adminEmail || password !== adminPassword) {
      recordFailedLogin(clientIp, email);
      res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
      return;
    }

    clearFailedLogins(clientIp);

    // Read lazily (not as a module-level constant) so this reflects .env
    // even when dotenv.config() runs after this module is first imported.
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_change_in_production";
    const token = jwt.sign(
      { uid: "admin", email: adminEmail, role: "admin" },
      jwtSecret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE_MS,
    });

    await sendSecurityEvent(
      "Başarılı Giriş",
      `Admin girişi: ${email} (IP: ${clientIp})`,
      0x00ff00
    );

    res.json({
      success: true,
      message: "Başarıyla giriş yapıldı.",
    });
  } catch (err) {
    console.error("Login Error:", err);
    recordFailedLogin(clientIp, email);
    res.status(500).json({ error: "Giriş yapılırken sunucu hatası oluştu." });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ success: true, message: "Çıkış yapıldı." });
}

export async function checkSession(req: Request, res: Response): Promise<void> {
  // If request passed the requireAuth middleware, session is valid
  const user = (req as any).user;
  res.json({
    success: true,
    user: { email: user.email },
  });
}
