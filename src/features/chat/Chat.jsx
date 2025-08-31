import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";

function Chat() {
  
  return (
    <div className="h-screen flex flex-col w-4/5 bg-neutral-50 dark:bg-gray-800 text-gray-900 dark:text-neutral-50">
      <ChatHeader />
      <Conversation />
      <ChatInput />
    </div>
  );
}

export default Chat;
