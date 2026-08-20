import { useChat } from "../context/usechat";

function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    newChat,
    chats,
    loadChat,
    deleteChat,
    activeChatId,
  } = useChat();

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "open" : "closed"
      }`}
    >
      <div className="sidebar-top">
        <button
          className="menu-button"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        >
          ☰
        </button>

        {sidebarOpen && (
          <h2>Groq AI</h2>
        )}
      </div>

      {sidebarOpen && (
        <>
          <button
            className="new-chat-button"
            onClick={newChat}
          >
            + New Chat
          </button>

          <div className="history">
            <h3>Recent Chats</h3>

            {chats.length === 0 ? (
              <p className="empty-history">
                No conversations yet.
              </p>
            ) : (
              <div className="chat-history">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`history-item ${chat.id === activeChatId ? "active" : ""}`}
                  >
                    <button
                      className="history-title"
                      onClick={() =>
                        loadChat(chat)
                      }
                    >
                      {chat.title}
                    </button>

                    <button
                      className="delete-chat"
                      onClick={() =>
                        deleteChat(chat.id)
                      }
                      title="Delete chat"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
