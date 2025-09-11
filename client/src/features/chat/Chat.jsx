import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";
import ChatHome from "./ChatHome";

function Chat() {
  const currentId = useSelector((state) => state.chat.currentId);

  return (
    <div className="flex flex-col w-4/5">
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
