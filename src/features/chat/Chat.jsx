import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

function Chat() {
  return (
    <div className="chat-container">
      <ChatHeader />
      <p>Message</p>
      <ChatInput />
    </div>
  );
}

export default Chat;
