import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import conversationRoutes from "./routes/conversations.js";
import { seed } from "./seeds/seed.js";
import connectDB from "./db/db.js";
import https from "https";
import fs from "fs";

// Configuring environment variables and middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("common"));

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://assistant.jorgenlt.no",
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
connectDB();

const PORT = process.env.PORT || 6001;
const HTTPS_PORT = 443;
const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV === "production") {
  // HTTPS configuration (Cloudflare Origin Cert)
  const httpsOptions = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
  };

  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS API running on port ${HTTPS_PORT}`);
  });
} else {
  // Local development (HTTP)
  app.listen(PORT, () => {
    console.log(`HTTP API running on port ${PORT}`);
  });
}

// app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

// *** Uncomment once to run function to add seeds ***
// seed();
