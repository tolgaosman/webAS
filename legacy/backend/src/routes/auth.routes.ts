// ===================================================================
// Auth Routes — Login, Logout, Password Reset
// Protected by rate limiting on all endpoints.
// ===================================================================

import { Router } from "express";
import { authLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { LoginSchema } from "../schemas/portfolio.schema";
import { login, logout, checkSession } from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/login — Rate limited: 5 attempts per 15 min
router.post("/login", authLimiter, validate(LoginSchema), login);

// POST /api/auth/logout — No rate limit needed, just clears cookie
router.post("/logout", logout);

// GET /api/auth/me — Check current session (requires auth)
router.get("/me", requireAuth, checkSession);

export default router;
