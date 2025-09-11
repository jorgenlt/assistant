import express from "express";
import { getUser, addApiKey } from "../controllers/userController.js";

// Importing verifyToken middleware function from auth middleware
import { verifyToken } from "../middleware/auth.js";

// Creating a new router object from the express module
const router = express.Router();

// Setting up a GET route at "/:id" 
// The verifyToken middleware is run first to authenticate the user
// If authentication passes, the getUser function is executed to fetch specific user details
router.get("/:id", verifyToken, getUser);
router.patch("/:id/apikeys/", addApiKey);

// Exporting the router object so it can be used by other modules
export default router;
