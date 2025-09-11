import jwt from "jsonwebtoken";

// Verify the token provided in the request
export const verifyToken = async (req, res, next) => {
  try {
    // Extracts the token from the Authorization header of the incoming request
    let token = req.header("Authorization");

    // If no token is provided, return a 403 status code (Access Denied)
    if (!token) {
      return res.status(403).send("Access denied.");
    }

    // If the token starts with 'Bearer ', remove it for further processing
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Verify the token using JWT_SECRET from environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Assign the verified user details to the request object
    req.user = verified;

    // Continue with the next middleware function
    next();
  } catch (err) {
    // If any error occurred during verification, return a 500 status code (Internal Server Error) and the error message
    res.status(500).json({ error: err.message });
  }
};
