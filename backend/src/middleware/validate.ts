// ===================================================================
// Zod Validation Middleware
// Validates request body against a Zod schema before the handler runs.
// ===================================================================

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Express middleware factory that validates req.body against the given Zod schema.
 * Returns 400 with detailed error messages if validation fails.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parse and replace body with validated + typed data
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        res.status(400).json({
          error: "Doğrulama hatası. Lütfen girişlerinizi kontrol edin.",
          details: errors,
        });
        return;
      }

      res.status(400).json({ error: "Geçersiz istek verisi." });
    }
  };
}
