function Loading() {
  return (
    <div className="loading-message">
      <div className="message-avatar">AI</div>

      <div className="loading-content">
        <div className="message-role">Groq AI</div>

        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Loading;