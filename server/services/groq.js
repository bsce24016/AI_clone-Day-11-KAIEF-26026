import Groq from "groq-sdk";

const supportedModels = new Set([
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
]);

export async function generateResponse(messages, requestedModel) {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("GROQ_API_KEY is missing. Add it to server/.env.");
    error.status = 503;
    throw error;
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const model = supportedModels.has(requestedModel)
    ? requestedModel
    : supportedModels.has(process.env.GROQ_MODEL)
      ? process.env.GROQ_MODEL
      : "openai/gpt-oss-20b";

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "You are Groq AI, a helpful, accurate assistant. Use Markdown when it improves clarity.",
      },
      ...messages,
    ],
    temperature: 0.7,
    max_completion_tokens: 2048,
  });

  return completion.choices[0]?.message?.content?.trim() || "I couldn't generate a response. Please try again.";
}
