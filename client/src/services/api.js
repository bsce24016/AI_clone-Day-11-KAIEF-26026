const configuredApiUrl = import.meta.env.VITE_API_URL || "";
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
