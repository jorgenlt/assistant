import ChatInput from "./ChatInput";

function ChatHome() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Assistant</h1>
      <div className="w-full text-center bg-[var(--bg)] text-[var(--text)] mb-6">
        <ChatInput />
      </div>
    </div>
  );
}

export default ChatHome;
