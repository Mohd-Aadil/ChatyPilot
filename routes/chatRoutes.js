import express from "express";
import {
  chatHandler,
  deleteConversation,
  getConversations,
  renameConversation,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", authMiddleware, chatHandler);
router.get("/getConversations", authMiddleware, getConversations);
router.post("/deleteConversation", authMiddleware, deleteConversation);
router.post("/renameConversation", authMiddleware, renameConversation);

export default router;
