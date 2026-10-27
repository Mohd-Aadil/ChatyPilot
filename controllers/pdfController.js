import { Op } from "sequelize";
import { PDFChunk } from "../models/pdfChunkModel.js";
import { getAIResponse } from "../services/apiProvider.js";
import { createEmbedding } from "../services/embeddingService.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";
import { pdf } from "../models/pdfModel.js";
// import { getAIResponse } from "../services/geminiService.js";

export const askPDFQuestion = async (req, res) => {
  try {
    // 📩 Get data from frontend
    // const { pdfId, question, provider } = req.body;
    const { question, provider } = req.body;

    // ❌ Validation
    // if (!pdfId || !question) {
    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const questionEmbedding = await createEmbedding(question);
    console.log("questionEmbedding", questionEmbedding);

    if (!questionEmbedding) {
      return res.status(400).json({
        success: false,
        message: "questionEmbedding not generated",
      });
    }

    const userPDFs = await pdf.findAll({
      where: {
        userId: req.userId,
      },
    });

    const pdfIds = userPDFs.map((pdf) => pdf.id);
    console.log("pdfIds", pdfIds);

    const chunks = await PDFChunk.findAll({
      where: {
        pdfId: {
          [Op.in]: pdfIds,
        },
      },
    });

    // 🔍 STEP 1: Fetch chunks from DB
    // const chunks = await PDFChunk.findAll({
    //   where: { pdfId },
    //   limit: 5,
    // });

    // search on base of question
    // let chunks = await PDFChunk.findAll({
    //   where: {
    //     pdfId,
    //     content: {
    //       [Op.like]: `${question}`,
    //     },
    //   },
    //   limit: 5,
    // });

    // if (chunks.length === 0) {
    //   chunks = await PDFChunk.findAll({
    //     where: { pdfId },
    //     limit: 5,
    //   });
    // }

    // const chunks = await PDFChunk.findAll({
    //   where: { pdfId },
    // });
    // Each chunk gets:
    // {
    //   content: "...",
    //   score: 0.91
    // }
    const scoredChunks = chunks.map((chunk) => ({
      content: chunk.content,
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
      chunkIndex: chunk.chunkIndex,
      pdfFileName: chunk.pdfFileName,
    }));
    console.log("scoredChunks", scoredChunks);

    // TOP 5 most semantically similar chunks
    const topChunks = scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    console.log("topChunks", topChunks);

    // 🧠 STEP 2: Combine chunks into context
    // const context = chunks.map((chunk) => chunk.content).join("\n\n");
    const context = topChunks.map((chunk) => chunk.content).join("\n\n");

    console.log("context", context);

    // 🤖 STEP 3: Create AI prompt
    const prompt = `
Answer ONLY using the PDF context below.

PDF Context:
${context}

Question:
${question}
`;

    // 🚀 STEP 4: Send to Gemini
    const aiResponse = await getAIResponse(provider, [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ]);

    const sources = topChunks.map((chunk) => ({
      pdfFileName: chunk.pdfFileName,
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
    }));
    console.log("sources", sources);

    // ✅ Return response
    return res.status(200).json({
      success: true,
      answer: aiResponse,
      sources,
    });
  } catch (error) {
    console.error("Ask PDF Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
