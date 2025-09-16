import express from "express";
import {
  createConversation,
  getConversationsForUser,
  getConversation,
  addMessage,
  generateTitle,
  deleteConversation,
} from "../controllers/conversationController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createConversation);
router.get("/", verifyToken, getConversationsForUser);
// router.get("/:id", getConversation);
router.delete("/:id", verifyToken, deleteConversation);
router.post("/:id/messages", verifyToken, addMessage);
router.post("/:id/title/generate", verifyToken, generateTitle);

export default router;
