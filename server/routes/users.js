import express from "express";
import { getUser, addApiKey } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.patch("/:id/apikeys/", verifyToken, addApiKey);

export default router;
