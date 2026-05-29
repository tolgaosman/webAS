// ===================================================================
// Data Controller — Portfolio CRUD with Sanitization
// All data is validated by Zod before reaching this layer.
// All string outputs are sanitized to prevent Stored XSS.
// ===================================================================

import { Request, Response } from "express";
import { getFirestore } from "../services/firebase";
import { sanitizeObject } from "../utils/sanitize";

const COLLECTION = "portfolio";
const DOC_ID = "data";

/**
 * GET /api/portfolio
 * Public endpoint — returns the sanitized portfolio data.
 * No authentication required (public website reads this).
 */
export async function getPortfolioData(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const db = getFirestore();
    const docRef = db.collection(COLLECTION).doc(DOC_ID);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).json({ error: "Portfolyo verisi bulunamadı." });
      return;
    }

    const data = docSnap.data();

    // Sanitize all string values before sending to client
    const sanitizedData = sanitizeObject(data);

    res.json(sanitizedData);
  } catch (err) {
    console.error("Error fetching portfolio data:", err);
    res.status(500).json({ error: "Veri alınırken hata oluştu." });
  }
}

/**
 * PUT /api/portfolio
 * Protected endpoint — updates the entire portfolio data.
 * Requires authentication (admin only).
 * Request body is already validated by Zod middleware.
 */
export async function updatePortfolioData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const db = getFirestore();
    const docRef = db.collection(COLLECTION).doc(DOC_ID);

    // Body is already validated and typed by Zod middleware
    const validatedData = req.body;

    // Additional sanitization layer — escape HTML in all string fields
    const sanitizedData = sanitizeObject(validatedData);

    await docRef.set(sanitizedData, { merge: false });

    res.json({
      success: true,
      message: "Portfolyo verisi başarıyla güncellendi.",
    });
  } catch (err) {
    console.error("Error updating portfolio data:", err);
    res.status(500).json({ error: "Veri güncellenirken hata oluştu." });
  }
}

/**
 * PATCH /api/portfolio/:section
 * Protected endpoint — updates a specific section of portfolio data.
 * Requires authentication (admin only).
 */
export async function updateSection(
  req: Request,
  res: Response
): Promise<void> {
  const section = req.params.section as string;

  const allowedSections = [
    "personal",
    "coreSkills",
    "projects",
    "education",
    "experience",
    "languages",
    "toolkit",
    "certificates",
  ];

  if (!allowedSections.includes(section)) {
    res.status(400).json({ error: `Geçersiz bölüm: ${section}` });
    return;
  }

  try {
    const db = getFirestore();
    const docRef = db.collection(COLLECTION).doc(DOC_ID);

    // Sanitize the section data
    const sanitizedData = sanitizeObject(req.body);

    await docRef.update({ [section]: sanitizedData });

    res.json({
      success: true,
      message: `"${section}" bölümü başarıyla güncellendi.`,
    });
  } catch (err) {
    console.error(`Error updating section ${section}:`, err);
    res.status(500).json({ error: "Bölüm güncellenirken hata oluştu." });
  }
}
