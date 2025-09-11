import express from "express";
import { login, register, logout } from "../controllers/authController.js";

// Creating a new router object from the express module
const router = express.Router();

// Setting up a POST route at /login
// When this route is hit, the login function imported from auth controller will be executed
router.post("/login", login);

// Setting up a POST route at /register
// When this route is hit, the register function imported from auth controller will be executed
router.post("/register", register);

// Setting up a POST route at /logout
router.post("/logout", logout);

export default router;
