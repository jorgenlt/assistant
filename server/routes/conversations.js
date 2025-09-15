import express from "express";
import {
  createConversation,
  getConversationsForUser,
  getConversation,
  addMessage,
  generateTitle,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/", getConversationsForUser);
router.get("/:id", getConversation);
router.delete("/:id", deleteConversation);
router.post("/:id/messages", addMessage);
router.post("/:id/title/generate", generateTitle);

export default router;
