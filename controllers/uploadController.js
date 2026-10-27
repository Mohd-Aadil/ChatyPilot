import { PDFChunk } from "../models/pdfChunkModel.js";
import { pdf as PDF } from "../models/pdfModel.js";
import { createEmbedding } from "../services/embeddingService.js";
import { extractPDFText, splitTextIntoChunk } from "../services/pdfService.js";

export const uploadPDF = async (req, res) => {
  try {
    const file = req.file;

    // Check file exists
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    // // Validate file type
    // if (file.mimetype !== "application/pdf") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Only PDF files are allowed",
    //   });
    // }

    // Check for duplicate
    const existing = await PDF.findOne({
      where: { fileName: file.originalname, userId: req.userId },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This PDF has already been uploaded",
      });
    }

    // Create PDF record
    const pdf = await PDF.create({
      fileName: file.originalname,
      userId: req.userId,
    });

    // Extract text from PDF
    const extractedText = await extractPDFText(file.path);

    // Check extracted text
    if (!extractedText || extractedText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from PDF",
      });
    }

    // Split into chunks
    const chunks = splitTextIntoChunk(extractedText);

    // Check chunks
    if (!chunks || chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid content found in PDF",
      });
    }

    // Save chunks
    // for (const chunk of chunks) {
    //   await PDFChunk.create({
    //     pdfId: pdf.id,
    //     content: chunk,
    //   });
    // }

    // for (const chunk of chunks) {
    //   const embedding = await createEmbedding(chunk);

    //   await PDFChunk.create({
    //     pdfId: pdf.id,
    //     content: chunk,
    //     embedding,
    //   });
    // }

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];

      const embedding = await createEmbedding(chunk);

      await PDFChunk.create({
        pdfId: pdf.id,
        pdfFileName: pdf.fileName,
        chunkIndex: index + 1,
        content: chunk,
        embedding,
      });
    }

    return res.status(201).json({
      success: true,
      message: "PDF uploaded successfully",
      pdfId: pdf.id,
    });
  } catch (error) {
    console.error("Upload PDF Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
