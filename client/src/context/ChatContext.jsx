import { createContext, useEffect, useMemo, useState } from "react";
import { sendMessage } from "../services/api";

export const ChatContext = createContext(null);

const STORAGE_KEY = "groq-ai-chats";
const makeId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
const legacyModels = {
  "llama-3.3-70b-versatile": "openai/gpt-oss-120b",
  "llama-3.1-8b-instant": "openai/gpt-oss-20b",
};
const getInitialModel = () => legacyModels[localStorage.getItem("groq-ai-model")]
  || localStorage.getItem("groq-ai-model")
  || "openai/gpt-oss-20b";
const getTitle = (items) => {
  const text = items.find((item) => item.role === "user")?.content || "New conversation";
  return text.length > 42 ? `${text.slice(0, 42)}…` : text;
};

function getSavedChats() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState(getSavedChats);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [model, setModel] = useState(getInitialModel);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)), [chats]);
  useEffect(() => localStorage.setItem("groq-ai-model", model), [model]);

  const saveMessages = (nextMessages, id = activeChatId) => {
    if (!nextMessages.length) return;
    const chatId = id || makeId();
    const chat = { id: chatId, title: getTitle(nextMessages), messages: nextMessages, updatedAt: Date.now() };
    setChats((previous) => [chat, ...previous.filter((item) => item.id !== chatId)]);
    setActiveChatId(chatId);
  };

  const newChat = () => {
    if (loading) return;
    setMessages([]);
    setActiveChatId(null);
  };

  const loadChat = (chat) => {
    if (loading) return;
    setMessages(chat.messages);
    setActiveChatId(chat.id);
    if (window.innerWidth <= 700) setSidebarOpen(false);
  };

  const deleteChat = (chatId) => {
    setChats((previousChats) =>
      previousChats.filter(
        (chat) => chat.id !== chatId
      )
    );
    if (chatId === activeChatId) newChat();
  };

  const sendChatMessage = async (message, history = messages) => {
    const userMessage = {
      id: makeId(),
      role: "user",
      content: message,
    };

    const updatedMessages = [
      ...history,
      userMessage,
    ];

    const chatId = activeChatId || makeId();
    setMessages(updatedMessages);
    saveMessages(updatedMessages, chatId);
    setLoading(true);

    try {
      const aiResponse =
        await sendMessage(updatedMessages.map(({ role, content }) => ({ role, content })), model);

      const completeMessages = [
        ...updatedMessages,
        {
          id: makeId(),
          role: "assistant",
          content: aiResponse,
        },
      ];
      setMessages(completeMessages);
      saveMessages(completeMessages, chatId);
    } catch (error) {
      console.error("AI request failed:", error);

      const completeMessages = [
        ...updatedMessages,
        {
          id: makeId(),
          role: "assistant",
          content: `**Request failed**\n\n${error.message}`,
        },
      ];
      setMessages(completeMessages);
      saveMessages(completeMessages, chatId);
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    if (loading || messages.at(-1)?.role !== "assistant") return;
    const history = messages.slice(0, -1);
    const prompt = history.at(-1)?.content;
    if (!prompt) return;
    setMessages(history);
    await sendChatMessage(prompt, history.slice(0, -1));
  };

  const value = useMemo(() => ({
    messages,
    chats,
    loading,
    sidebarOpen,
    activeChatId,
    model,
    setSidebarOpen,
    setModel,
    newChat,
    loadChat,
    deleteChat,
    sendChatMessage,
    regenerate,
  }), [messages, chats, loading, sidebarOpen, activeChatId, model]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}
