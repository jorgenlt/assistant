import { useRef, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentConversation,
  selectCurrentConversationMessages,
  selectStatusError,
} from "./chatSelectors.js";
import { formatDate } from "../../common/utils/formatDate.js";
import { PropagateLoader } from "react-spinners";
import AssistantMessage from "./components/AssistantMessage.jsx";
import UserMessage from "./components/UserMessage.jsx";

const Conversation = () => {
  const isThemeDark = useSelector((state) => state.menu.isThemeDark);
  const { error, status } = useSelector(selectStatusError);
  const conversation = useSelector(selectCurrentConversation);
  const messages = useSelector(selectCurrentConversationMessages);

  // Scroll to bottom when messages change
  const scrollRef = useRef();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, status]);

  return (
    <div ref={scrollRef} className="flex justify-center flex-1 overflow-y-auto">
      <div className="px-2 w-3/5 flex flex-col">
        {messages?.map((message, i) => {
          const { created, content, role } = message;

          const formattedCreated = formatDate(created);
          const formattedPrevMsgCreated = messages[i - 1]?.created
            ? formatDate(messages[i - 1].created)
            : null;

          return (
            <div key={i}>
              {/* Date separator */}
              {formattedCreated !== formattedPrevMsgCreated && (
                <div className="w-full text-center mt-20 mb-10">
                  <span className="text-gray-400">{formattedCreated}</span>
                </div>
              )}

              {/* Message */}
              <div
                className={`flex mb-20 ${
                  role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {role === "assistant" ? (
                  // Assistant
                  <AssistantMessage content={content} />
                ) : (
                  // User
                  <UserMessage content={content} />
                )}
              </div>

              {error && (
                <div>
                  <p className="text-red-500">{error}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading state */}
        {status === "loading" && (
          <div className="flex justify-center align-start pb-10">
            <div className="p-3">
              <PropagateLoader
                size={12}
                color={isThemeDark ? "#fafafa" : "#121416"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Conversation);
