import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
// import { uploadPDF } from "../controllers/uploadController.js";
import { uploadPDFs } from "../controllers/uploadsController.js";

const router = express.Router();

router.post("/upload-pdf", authMiddleware, upload.array("pdf", 10), uploadPDFs);
// router.post("/upload-pdf", authMiddleware, upload.single("pdf"), uploadPDF);

export default router;
