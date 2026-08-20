import { ChatProvider } from "./context/ChatContext";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

function App() {
  return (
    <ChatProvider>
      <div className="app">
        <Sidebar />
        <Chat />
      </div>
    </ChatProvider>
  );
}

export default App;