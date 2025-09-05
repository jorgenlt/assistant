import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";

function ChatHome() {
  const error = useSelector((state) => state.chat.error);
  
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Assistant</h1>
      {error && (
        <div>
          <p className="text-red-500">{error}</p>
        </div>
      )}
      <div className="w-full text-center bg-[var(--bg)] text-[var(--text)] mb-6">
        <ChatInput />
      </div>
    </div>
  );
}

export default ChatHome;
