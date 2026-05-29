// ===================================================================
// Auth Routes — Login, Logout, Password Reset
// Protected by rate limiting on all endpoints.
// ===================================================================

import { Router } from "express";
import { authLimiter, resetLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import {
  LoginSchema,
  PasswordResetRequestSchema,
  PasswordResetConfirmSchema,
} from "../schemas/portfolio.schema";
import {
  login,
  logout,
  me,
  requestPasswordReset,
  confirmPasswordReset,
} from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/login — Rate limited: 5 attempts per 15 min
router.post("/login", authLimiter, validate(LoginSchema), login);

// POST /api/auth/logout — No rate limit needed, just clears cookie
router.post("/logout", logout);

// GET /api/auth/me — Check current session (requires auth)
router.get("/me", requireAuth, me);

// POST /api/auth/request-reset — Rate limited: 3 per 30 min
router.post(
  "/request-reset",
  resetLimiter,
  validate(PasswordResetRequestSchema),
  requestPasswordReset
);

// POST /api/auth/confirm-reset — Rate limited: 3 per 30 min
router.post(
  "/confirm-reset",
  resetLimiter,
  validate(PasswordResetConfirmSchema),
  confirmPasswordReset
);

export default router;
