import ChatInput from "./ChatInput";

function ChatHome() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Chat App</h1>
      <div className="w-full text-center text-gray-600 dark:text-gray-400 mb-6">
        <ChatInput />
      </div>
    </div>
  );
}

export default ChatHome;
