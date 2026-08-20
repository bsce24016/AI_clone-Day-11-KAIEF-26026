// Vite substitutes VITE_* variables when it builds the frontend. Keep the
// deployed API as a production fallback so a missing dashboard variable does
// not make the browser request Vercel's non-existent /api/chat route.
const productionApiUrl = "https://ai-clone-day-11-kaief-26026-6.onrender.com";
const configuredApiUrl = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? productionApiUrl : "");
const localApiUrl = "http://localhost:5000";

async function postChat(apiUrl, messages, model) {
  const response = await fetch(`${apiUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error ${response.status}`);
  }

  return response.json();
}

export async function sendMessage(messages, model) {
  let data;

  try {
    data = await postChat(configuredApiUrl, messages, model);
  } catch (error) {
    const canTryLocalApi = !configuredApiUrl && window.location.hostname === "localhost";
    if (!canTryLocalApi || error.name !== "TypeError") throw error;
    data = await postChat(localApiUrl, messages, model);
  }

  return data.response;
}
