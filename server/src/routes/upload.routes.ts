import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomBytes(8).toString("hex")}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

router.post("/", requireAuth, requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });
  const port = process.env.PORT || 4000;
  const baseUrl = process.env.PUBLIC_URL || `http://localhost:${port}`;
  res.status(201).json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});

export default router;
