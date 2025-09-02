import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../common/utils/formatDate.js";
import { PropagateLoader } from "react-spinners"; // loader
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Conversation = () => {
  const { currentId, conversations, error, status } = useSelector(
    (state) => state.chat
  );

  const isThemeDark = useSelector((state) => state.menu).isThemeDark;

  const conversation = conversations[currentId]?.messages;

  // Copy text to clipboard
  // const handleCopyToClipboard = async (text) => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     alert("Message copied to clipboard."); // swap with toast lib if you like
  //   } catch (err) {
  //     alert("Failed to copy: " + err.message);
  //   }
  // };

  // Scroll to bottom when messages change
  const scrollRef = useRef();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, status]);

  return (
    <div ref={scrollRef} className="flex justify-center flex-1 overflow-y-auto">
      <div className="px-2 w-3/5 flex flex-col gap-4">
        {conversation?.map((message, i) => {
          const { created, content, role } = message;
          const formattedCreated = formatDate(created);
          const formattedPrevMsgCreated = conversation[i - 1]?.created
            ? formatDate(conversation[i - 1].created)
            : null;

          return (
            <div key={i}>
              {/* Date separator */}
              {formattedCreated !== formattedPrevMsgCreated && (
                <div className="w-full text-center my-6">
                  <span className="text-gray-400">{formattedCreated}</span>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`flex my-1 ${
                  role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {role === "assistant" ? (
                  <div className="cursor-default max-w-full">
                    <div className="prose prose-base dark:prose-invert max-w-full">
                      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[var(--bg-chat-bubble)] rounded-2xl py-2 pl-4 pr-2 rounded-tr-sm max-w-[90%]">
                    <div className="prose prose-base max-w-full text-[var(--text-chat-bubble)]">
                      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                    </div>
                  </div>
                )}
              </div>
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

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Conversation;
