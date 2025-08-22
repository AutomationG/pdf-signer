import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const app = express();

const PORT = 4000;
const CORS_ORIGIN = "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Multer for in-memory PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDFs are allowed"));
    }
    cb(null, true);
  },
});

// Core mock signing route
app.post("/api/sign-pdf", upload.single("file"), async (req, res) => {
  try {
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
});


 // Stamps every page with a visible "Signed (Mock)" label
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
    // bottom-right corner
    page.drawText(stampText, {
      x: width - textWidth - margin,
      y: margin,
      size: fontSize,
      font,
      color: rgb(0.1, 0.6, 0.2),
      opacity: 0.85,
    });
  }

  const signedBytes = await doc.save({ useObjectStreams: false });
  return signedBytes;
}

// 404 fallback for other routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Mock PDF signing server listening on http://localhost:${PORT}`);
  console.log(`CORS origin allowed: ${CORS_ORIGIN}`);
});
