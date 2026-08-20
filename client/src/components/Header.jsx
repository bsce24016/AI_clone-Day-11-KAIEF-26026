import { useChat } from "../context/usechat";

function Header() {
  const { sidebarOpen, setSidebarOpen, model, setModel } = useChat();

  return (
    <header className="chat-header">
      {!sidebarOpen && (
        <button
          className="header-menu-button"
          onClick={() => setSidebarOpen(true)}
          title="Open sidebar"
        >
          ☰
        </button>
      )}

      <div className="header-info">
        <h1>Groq AI</h1>
        <span>AI Assistant</span>
      </div>

      <label className="model-picker">
        <span className="sr-only">Model</span>
        <select value={model} onChange={(event) => setModel(event.target.value)}>
          <option value="openai/gpt-oss-20b">GPT-OSS 20B · Fast</option>
          <option value="openai/gpt-oss-120b">GPT-OSS 120B · Best quality</option>
        </select>
      </label>
    </header>
  );
}

export default Header;
