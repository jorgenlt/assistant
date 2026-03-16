import { useRef, useEffect, useMemo, memo } from "react";
import { useSelector } from "react-redux";
import {
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
  const messages = useSelector(selectCurrentConversationMessages);

  const scrollRef = useRef();

  const lastMessageRef = useRef(null);

  const messageElements = useMemo(() => {
    if (!messages) return null;

    return messages.map((message, i) => {
      const { _id, created, content, role } = message;
      const formattedCreated = formatDate(created);
      const formattedPrevMsgCreated = messages[i - 1]?.created
        ? formatDate(messages[i - 1].created)
        : null;

      const isLast = i === messages.length - 1;
      
      return (
        <div key={_id || i} ref={isLast ? lastMessageRef : null}>
          {/* Date separator */}
          {formattedCreated !== formattedPrevMsgCreated && (
            <ConversationDate created={formattedCreated} />
          )}

          {/* Message */}
          <div
            className={`flex mb-20 ${
              role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {role === "user" ? (
              <UserMessage content={content} />
            ) : (
              <AssistantMessage content={content} />
            )}
          </div>
        </div>
      );
    });
  }, [messages]);

// Scroll to the last message, offset by 20% of the view height
useEffect(() => {
  const container = scrollRef.current;
  const lastEl = lastMessageRef.current;

  if (container) {
    if (lastEl) {
      const top = lastEl.offsetTop;
      const offset = container.clientHeight * 0.2;
      const target = Math.max(0, top - offset);
      container.scrollTop = target;
    } else {
      // Fallback: if last element isn't mounted yet
      container.scrollTop = container.scrollHeight;
    }
  }
}, [messages]);


  return (
    <div ref={scrollRef} className="flex justify-center flex-1 overflow-y-auto">
      <div className="px-2 w-full md:max-w-3xl md:min-w-xs flex flex-col">
        {messageElements}

        {error && <Error error={error} />}

        {status === "loading" && (
          <div className="pb-10">
            <ConversationLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Conversation);
