import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import Error from "./components/Error";
import { selectStatusError } from "./chatSelectors";
import { getWelcomeMessage, welcomeMessages } from "./utils/welcomeMessages";
import { useState } from "react";
import ConversationLoader from "./components/ConversationLoader";

const ChatHome = () => {
  const { error } = useSelector(selectStatusError);
  const createConversationStatus = useSelector(
    (state) => state.chat.createConversationStatus
  );
  console.log("🚀 ~ createConversationStatus:", createConversationStatus);

  const [message, setMessage] = useState(getWelcomeMessage(welcomeMessages));

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      {/* Welcome message */}
      <div
        className="cursor-default select-none max-w-3xl"
        onClick={() => setMessage(getWelcomeMessage(welcomeMessages))}
      >
        <h1 className="text-2xl">{message}</h1>
      </div>

      {/* Loading */}
      <div className="h-14 flex items-center">
        {createConversationStatus === "loading" && <ConversationLoader />}
      </div>

      {/* Error */}
      {error && <Error error={error} />}

      {/* Chat input */}
      <div className="w-full text-center bg-[var(--bg)] text-[var(--text)] mb-6">
        <ChatInput autoFocus={true} />
      </div>
    </div>
  );
};

export default ChatHome;
