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
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`
});
if (process.env.NODE_ENV === "development") {
  console.log("Development server")
}

const app = express();
app.use(express.json());
app.use(morgan("common"));


// Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://assistant.jorgenlt.no",
  "https://api-assistant.jorgenlt.no",
  "https://jorgenlt.no",
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Cloudfare static header
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    const secret = req.headers["cforigin"];
    if (secret !== process.env.CF_SECRET) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  });
}

// Log headers
// app.use((req, res, next) => {
//   console.log("Incoming request headers:", req.headers);  // ← This will show ALL headers
//   next();
// });

// Defining routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/conversations", conversationRoutes);

// Ping route
app.get("/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

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
