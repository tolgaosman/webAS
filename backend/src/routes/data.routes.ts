// ===================================================================
// Data Routes — Portfolio CRUD
// Public read, authenticated write with validation.
// ===================================================================

import { Router } from "express";
import { apiLimiter } from "../middleware/rateLimiter";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { PortfolioDataSchema } from "../schemas/portfolio.schema";
import {
  getPortfolioData,
  updatePortfolioData,
  updateSection,
} from "../controllers/data.controller";

const router = Router();

// GET /api/portfolio — Public (no auth required, rate limited)
router.get("/", apiLimiter, getPortfolioData);

// PUT /api/portfolio — Full update (auth + validation required)
router.put(
  "/",
  apiLimiter,
  requireAuth,
  validate(PortfolioDataSchema),
  updatePortfolioData
);

// PATCH /api/portfolio/:section — Partial section update (auth required)
router.patch("/:section", apiLimiter, requireAuth, updateSection);

export default router;
