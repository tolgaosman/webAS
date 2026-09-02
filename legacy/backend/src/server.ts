// ===================================================================
// Express Server Entry Point — Çelik Kale 🏰
// All 8 security layers integrated:
//   1. API Keys hidden in .env
//   2. Strict CORS (no wildcard)
//   3. Rate Limiting (tiered)
//   4. Input Validation (Zod)
//   5. Password Reset Token Expiry (30 min)
//   6. Security Headers (Helmet)
//   7. JWT Sessions (HTTP-Only cookies)
//   8. Breach Alerts (Discord webhook)
// ===================================================================

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { globalLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth.routes";
import dataRoutes from "./routes/data.routes";

// --- Load environment variables ---
// In production (Render), env vars are set via dashboard.
// Locally, use a .env file with a dotenv loader or tsx --env-file=.env
if (process.env.NODE_ENV !== "production") {
  try {
    // Dynamic import for dotenv in dev only
    require("dotenv").config();
  } catch {
    // dotenv not installed — that's fine for production
  }
}

// --- Removed Firebase ---
// --- Create Express App ---
const app = express();

// --- Trust proxy (required for Render, rate-limiter IP detection) ---
app.set("trust proxy", 1);

// ============================
// LAYER 6: Security Headers (Helmet)
// ============================
app.use(
  helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://www.gstatic.com",
          "https://www.google.com",
          "https://www.recaptcha.net",
          "https://translate.google.com",
          "https://translate.googleapis.com",
          "https://translate-pa.googleapis.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://translate.googleapis.com",
          "https://www.gstatic.com",
        ],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: [
          "'self'",
          "https://translate.googleapis.com",
          "https://translate-pa.googleapis.com",
          "https://www.google.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://www.recaptcha.net",
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    // Prevent clickjacking
    frameguard: { action: "deny" },
    // Prevent MIME-type sniffing
    noSniff: undefined,
    // XSS filter
    xssFilter: undefined,
    // HSTS - enforce HTTPS
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    // Hide X-Powered-By header
    hidePoweredBy: undefined,
    // Referrer policy
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// ============================
// LAYER 2: Strict CORS Policy
// ============================
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⛔ CORS blocked request from origin: ${origin}`);
        callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true, // Required for HTTP-Only cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400, // Pre-flight cache: 24 hours
  })
);

// --- Body Parsers ---
app.use(express.json({ limit: "1mb" })); // Limit payload size
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());

// ============================
// LAYER 3: Global Rate Limiting
// ============================
app.use(globalLimiter);

// --- Health Check ---
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    security: "🏰 Çelik Kale Active",
  });
});

// --- API Routes ---
// Removed /api/config since Firebase config is gone
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", dataRoutes);

// --- 404 Handler ---
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint bulunamadı." });
});

// --- Global Error Handler ---
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);

    // Never expose internal error details in production
    const message =
      process.env.NODE_ENV === "production"
        ? "Sunucu hatası oluştu."
        : err.message;

    res.status(500).json({ error: message });
  }
);

// --- Start Server ---
const PORT = parseInt(process.env.PORT || "4000", 10);
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║  🏰 Çelik Kale Backend — Port ${PORT}           ║
║  ✅ Helmet Security Headers                  ║
║  ✅ Strict CORS (no wildcard)                ║
║  ✅ Rate Limiting (tiered)                   ║
║  ✅ Zod Input Validation                     ║
║  ✅ JWT HTTP-Only Cookies                    ║
║  ✅ ║  ✅ Discord Breach Alerts                    ║
║  ✅ Local Storage (Self-Hosted)              ║
╚══════════════════════════════════════════════╝
  `);
});

export default app;
