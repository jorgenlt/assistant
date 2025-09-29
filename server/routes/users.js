import express from "express";
import {
  getUser,
  addApiKey,
  hasApiKeys,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.patch("/:id/apikeys/", verifyToken, addApiKey);
router.get("/:id/apikeys/hasapikeys", verifyToken, hasApiKeys);

export default router;
