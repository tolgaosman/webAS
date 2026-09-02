import { Request, Response } from "express";
import { getPortfolioData, savePortfolioData } from "../services/storage";
import { sanitizeObject } from "../utils/sanitize";

/**
 * POST /api/portfolio/upload-image
 * Protected endpoint — accepts a single image file (multipart/form-data,
 * field name "file") and returns its public URL under /assets/uploads.
 */
export async function uploadImage(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: "Dosya bulunamadı." });
    return;
  }
  res.json({ url: `/assets/uploads/${req.file.filename}` });
}

/**
 * GET /api/portfolio
 */
export async function getPortfolioDataHandler(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const data = getPortfolioData();
    if (!data) {
      res.status(404).json({ error: "Portfolyo verisi bulunamadı." });
      return;
    }
    const sanitizedData = sanitizeObject(data);
    res.json(sanitizedData);
  } catch (err) {
    console.error("Error fetching portfolio data:", err);
    res.status(500).json({ error: "Veri alınırken hata oluştu." });
  }
}

/**
 * PUT /api/portfolio
 */
export async function updatePortfolioData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validatedData = req.body;
    const sanitizedData = sanitizeObject(validatedData);
    savePortfolioData(sanitizedData);

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
    const data = getPortfolioData() || {};
    const sanitizedData = sanitizeObject(req.body);
    
    data[section] = sanitizedData;
    savePortfolioData(data);

    res.json({
      success: true,
      message: `"${section}" bölümü başarıyla güncellendi.`,
    });
  } catch (err) {
    console.error(`Error updating section ${section}:`, err);
    res.status(500).json({ error: "Bölüm güncellenirken hata oluştu." });
  }
}
