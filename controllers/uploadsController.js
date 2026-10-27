import { PDFChunk } from "../models/pdfChunkModel.js";
import { pdf as PDF } from "../models/pdfModel.js";
import { createEmbedding } from "../services/embeddingService.js";
import { extractPDFText, splitTextIntoChunk } from "../services/pdfService.js";

export const uploadPDFs = async (req, res) => {
  try {

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No PDFs uploaded",
      });
    }

    const uploadedPDFs = [];

    for (const file of files) {

      const pdf = await PDF.create({
        fileName: file.filename,
        userId: req.userId,
      });

      const extractedText =
        await extractPDFText(file.path);

      const chunks =
        splitTextIntoChunk(extractedText);

      for (let index = 0; index < chunks.length; index++) {

        const chunk = chunks[index];

        const embedding =
          await createEmbedding(chunk);

        await PDFChunk.create({
          pdfId: pdf.id,
          pdfFileName: pdf.fileName,
          chunkIndex: index + 1,
          content: chunk,
          embedding,
        });
      }

      uploadedPDFs.push({
        pdfId: pdf.id,
        fileName: pdf.fileName,
      });
    }

    return res.status(200).json({
      success: true,
      uploadedPDFs,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};