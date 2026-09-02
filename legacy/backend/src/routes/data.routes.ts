// ===================================================================
// Data Routes — Portfolio CRUD
// Public read, authenticated write with validation.
// ===================================================================

import { Router } from "express";
import { apiLimiter } from "../middleware/rateLimiter";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { upload } from "../middleware/upload";
import { PortfolioDataSchema } from "../schemas/portfolio.schema";
import {
  getPortfolioDataHandler,
  updatePortfolioData,
  updateSection,
  uploadImage,
} from "../controllers/data.controller";

const router = Router();

// GET /api/portfolio — Public (no auth required, rate limited)
router.get("/", apiLimiter, getPortfolioDataHandler);

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

// POST /api/portfolio/upload-image — Image upload (auth required)
router.post(
  "/upload-image",
  apiLimiter,
  requireAuth,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: err.message || "Yükleme hatası." });
        return;
      }
      next();
    });
  },
  uploadImage
);

export default router;
