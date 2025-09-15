import express from "express";
import {
  getUser,
  addApiKey,
  hasApiKey,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.patch("/:id/apikeys/", verifyToken, addApiKey);
router.get("/:id/apikeys/exists", verifyToken, hasApiKey);

export default router;
