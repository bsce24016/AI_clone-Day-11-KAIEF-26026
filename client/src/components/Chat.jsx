import { useEffect, useRef } from "react";

import { useChat } from "../context/useChat";
import ChatInput from "./ChatInput";
import Message from "./Message";
import Loading from "./Loading";
import Header from "./Header";

const prompts = ["Explain a difficult concept simply", "Help me write a clean React component", "Create a plan for learning JavaScript"];

function Chat() {
  const { messages, loading, sendChatMessage } = useChat();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <main className="chat">
      <Header />

      <section className="messages">
        {messages.length === 0 ? (
          <div className="welcome">
            <div className="welcome-icon">✦</div>

            <h2>How can I help you?</h2>

            <p>
              Ask me anything. I can explain concepts,
              write code, analyze problems, and more.
            </p>

            <div className="suggestions">
              {prompts.map((prompt) => (
                <button key={prompt} onClick={() => sendChatMessage(prompt)}>{prompt}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message
              key={message.id || `${message.role}-${index}`}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))
        )}

        {loading && <Loading />}

        <div ref={messagesEndRef} />
      </section>

      <ChatInput />
    </main>
  );
}

export default Chat;
