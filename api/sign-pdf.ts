// disable eslint for this file as it is a serverless function
/* eslint-disable */
// disable typescript checking for this file as it is a serverless function
// @ts-nocheck

import multer from "multer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Multer setup (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs are allowed"));
    }
    cb(null, true);
  },
});

// Utility to run multer inside a serverless function
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

// Hono-style route converted for Vercel Serverless
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload.single("file"));

    if (!req.file) {
      return res.status(400).json({ error: "No PDF uploaded." });
    }

    const original = req.file.buffer;
    const signed = await mockSignPdf(original);
    const filename = (req.file.originalname || "document.pdf").replace(/\.pdf$/i, "");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}-signed.pdf"`);
    return res.status(200).send(Buffer.from(signed));
  } catch (err) {
    console.error("Signing error:", err);
    return res.status(500).json({ error: "Failed to sign the PDF (mock)." });
  }
}

// PDF stamping logic
async function mockSignPdf(buffer) {
  const now = new Date();
  const stampText = `Signed (Mock) • ${now.toISOString()}`;
  const doc = await PDFDocument.load(buffer);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(stampText, fontSize);
    const margin = 16;
    page.drawText(stampText, {
      x: width - textWidth - margin,
      y: margin,
      size: fontSize,
      font,
      color: rgb(0.1, 0.6, 0.2),
      opacity: 0.85,
    });
  }

  return await doc.save({ useObjectStreams: false });
}
