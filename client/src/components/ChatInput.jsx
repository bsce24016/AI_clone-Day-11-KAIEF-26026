import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/useChat";

function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const {
    sendChatMessage,
    loading,
  } = useChat();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [input]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setInput("");

    await sendChatMessage(message);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <div className="input-area">
      <form
        className="chat-input-container"
        onSubmit={handleSubmit}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask Groq AI anything..."
          rows="1"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="send-button"
        >
          ↑
        </button>
      </form>

      <p className="input-hint">
        Enter to send • Shift + Enter for new line
      </p>
    </div>
  );
}

export default ChatInput;
