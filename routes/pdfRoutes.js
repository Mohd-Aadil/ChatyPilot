import express from "express";
import { askPDFQuestion } from "../controllers/pdfController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/ask-pdf", authMiddleware, askPDFQuestion);

export default router;
