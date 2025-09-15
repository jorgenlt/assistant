import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import Error from "./components/Error";
import { selectStatusError } from "./chatSelectors";

const ChatHome = () => {
  const { error } = useSelector(selectStatusError);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      {/* Welcome message */}
      <h1 className="text-2xl font-bold mb-4">Welcome to Assistant</h1>

      {/* Error */}
      {error && <Error error={error} />}

      {/* Chat input */}
      <div className="w-full text-center bg-[var(--bg)] text-[var(--text)] mb-6">
        <ChatInput />
      </div>
    </div>
  );
}

export default ChatHome;
