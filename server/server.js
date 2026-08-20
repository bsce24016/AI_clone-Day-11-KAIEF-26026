import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRouter from "./routes/chat.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    // Allow local Vite ports during development and explicitly configured production origins.
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin is not allowed by CORS."));
  },
}));

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Day 11 Groq AI Clone API is running.",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", groqConfigured: Boolean(process.env.GROQ_API_KEY) });
});

app.use("/api/chat", chatRouter);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  next(error);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
