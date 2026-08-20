import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChat } from "../context/useChat";

function Message({ message, isLast }) {
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState(
    message.role === "assistant" ? "" : message.content
  );

  useEffect(() => {
    if (message.role !== "assistant") {
      setDisplayedText(message.content);
      return;
    }

    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      index += 2;

      setDisplayedText(message.content.slice(0, index));

      if (index >= message.content.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [message.content, message.role]);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message-avatar">
        {message.role === "user" ? "U" : "AI"}
      </div>

      <div className="message-body">
        <div className="message-role">
          {message.role === "user" ? "You" : "Groq AI"}
        </div>

        <div className="message-content">
          {message.role === "assistant" ? (
            <ReactMarkdown
              components={{
                code({
                  inline,
                  className,
                  children,
                  ...props
                }) {
                  const match = /language-(\w+)/.exec(
                    className || ""
                  );

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {displayedText}
            </ReactMarkdown>
          ) : (
            displayedText
          )}
        </div>

        {message.role === "assistant" && <div className="message-actions">
          <button className="copy-button" onClick={copyMessage} title="Copy response">{copied ? "Copied" : "Copy"}</button>
          {isLast && <RegenerateButton />}
        </div>}
      </div>
    </div>
  );
}

function RegenerateButton() {
  const { regenerate, loading } = useChat();
  return <button className="copy-button" onClick={regenerate} disabled={loading} title="Generate another response">Regenerate</button>;
}

export default Message;
