import express from "express";
import { generateResponse } from "../services/groq.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages, model } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "At least one message is required.",
      });
    }

    const validRoles = new Set(["user", "assistant"]);
    const cleanedMessages = messages
      .filter((message) => validRoles.has(message?.role) && typeof message.content === "string")
      .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 12000) }))
      .filter((message) => message.content);

    if (cleanedMessages.length === 0 || cleanedMessages.at(-1).role !== "user") {
      return res.status(400).json({ error: "The latest message must be a non-empty user message." });
    }

    const response = await generateResponse(cleanedMessages.slice(-20), model);

    res.json({
      response,
    });
  } catch (error) {
    console.error("Groq API error:", error.message);

    const status = error.status === 401 ? 401 : error.status === 404 ? 400 : error.status === 429 ? 429 : 503;
    res.status(status).json({
      error: error.status === 401
        ? "The Groq API key is invalid. Update server/.env and restart the server."
        : error.status === 404
          ? "The selected Groq model is unavailable. Choose another model and try again."
        : error.status === 429
          ? "Groq is temporarily rate-limited. Please try again in a moment."
          : "Unable to reach Groq right now. Check your API key and server connection.",
    });
  }
});

export default router;
