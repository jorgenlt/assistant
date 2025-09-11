import express from "express";
import {
  createConversation,
  getConversationsForUser,
  getConversation,
  addMessage,
  updateTitle,
  generateTitle,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/", createConversation);
router.get("/", getConversationsForUser);
router.get("/:id", getConversation);
router.post("/:id/messages", addMessage);
router.put("/:id/title", updateTitle);
router.post("/:id/title/generate", generateTitle);

export default router;
