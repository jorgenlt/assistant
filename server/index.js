import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import conversationRoutes from "./routes/conversations.js";
import { seed } from "./seeds/seed.js";
import connectDB from "./db/db.js";

// Configuring environment variables and middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("common"));

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", // Replace with the client-side origin
  credentials: true, // Allow sending credentials (cookies, headers, etc.)
};

app.use(cors(corsOptions));

// Defining routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/conversations", conversationRoutes)

// Default Route Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Setting up mongoDB and starting the server
const PORT = process.env.PORT || 6001;

connectDB();

app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

// *** Uncomment once to run function to add seeds ***
// seed();
