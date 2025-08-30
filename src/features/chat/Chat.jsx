import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

function Chat() {
  console.log("Rendering Chat component");
  return (
    <div className="chat-container">
      <ChatHeader />
      <p>Message</p>
      <ChatInput />
    </div>
  );
}

export default Chat;
