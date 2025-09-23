import { useRef, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentConversation,
  selectCurrentConversationMessages,
  selectStatusError,
} from "./chatSelectors.js";
import { formatDate } from "../../common/utils/formatDate.js";
import AssistantMessage from "./components/AssistantMessage.jsx";
import UserMessage from "./components/UserMessage.jsx";
import ConversationLoader from "./components/ConversationLoader.jsx";
import ConversationDate from "./components/ConversationDate.jsx";
import Error from "./components/Error.jsx";

const Conversation = () => {
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
      <div className="px-2 w-full md:max-w-3xl md:min-w-xs flex flex-col">
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
                <ConversationDate created={formattedCreated} />
              )}

              {/* Message */}
              <div
                className={`flex mb-20 ${
                  role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {role === "assistant" ? (
                  <AssistantMessage content={content} />
                ) : (
                  <UserMessage content={content} />
                )}
              </div>

              {/* Error */}
              {error && <Error error={error} />}
            </div>
          );
        })}

        {/* Loading state */}
        {status === "loading" && <ConversationLoader />}
      </div>
    </div>
  );
};

export default memo(Conversation);
