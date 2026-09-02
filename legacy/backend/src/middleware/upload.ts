// ===================================================================
// Image Upload Middleware — Local Disk Storage
// Saves admin-uploaded images to backend/data/uploads, served via
// server.ts's /uploads static route (and proxied by nginx in prod).
// ===================================================================

import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Same dev/prod split as services/storage.ts's DATA_FILE — in prod (Docker),
// this is bind-mounted to ./assets/uploads on the host so nginx can serve
// uploaded images as plain static files under /assets/uploads/.
export const UPLOADS_DIR =
  process.env.NODE_ENV === "production"
    ? path.join("/app", "uploads")
    : path.join(__dirname, "../../../assets/uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    // Never trust the client-supplied name/path — generate our own.
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 60);
    const uniqueSuffix = crypto.randomBytes(6).toString("hex");
    cb(null, `${safeBase || "image"}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error("Yalnızca JPEG, PNG, WEBP veya GIF görselleri yüklenebilir."));
      return;
    }
    cb(null, true);
  },
});
