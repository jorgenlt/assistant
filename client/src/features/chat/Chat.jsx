import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Conversation from "./Conversation";
import ChatHome from "./ChatHome";

const Chat = () => {
  const currentId = useSelector((state) => state.chat.currentId);

  return (
    <>
      <ChatHeader />
      {currentId === null ? (
        <ChatHome />
      ) : (
        <>
          <Conversation />
          <ChatInput />
        </>
      )}
    </>
  );
};

export default Chat;
