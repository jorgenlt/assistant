import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";
import ChatHome from "./ChatHome";

function Chat() {
  const currentId = useSelector((state) => state.chat.currentId);

  return (
    <div className="h-screen flex flex-col w-4/5 bg-neutral-50 dark:bg-gray-800 text-gray-900 dark:text-neutral-50">
      <ChatHeader />
      {currentId === null ? (
        <ChatHome />
      ) : (
        <>
          <Conversation />
          <ChatInput />
        </>
      )}
    </div>
  );
}

export default Chat;
