import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../common/utils/formatDate.js";
import { PropagateLoader } from "react-spinners"; // loader
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCopy } from "react-icons/fa6";

const Conversation = () => {
  const { currentId, conversations, error, status } = useSelector(
    (state) => state.chat
  );

  const isThemeDark = useSelector((state) => state.menu).isThemeDark;

  const conversation = conversations[currentId]?.messages;

  // Copy message to clipboard
  const handleCopyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      alert("Failed to copy: " + err.message);
    }
  };

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
                  // Assistant
                  <div className="cursor-default max-w-full">
                    <div className="prose prose-base dark:prose-invert max-w-full">
                      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                    </div>
                    <div 
                      onClick={() => handleCopyToClipboard(content)}
                      className="active:scale-90 mt-3 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)]">
                      <FaCopy size={16} />
                    </div>
                  </div>
                ) : (
                  // User
                  <div className="cursor-default bg-[var(--bg-chat-bubble)] rounded-2xl py-2 pl-4 pr-2 rounded-tr-sm max-w-[90%]">
                    <div className="prose prose-base max-w-full text-[var(--text-chat-bubble)]">
                      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                    </div>
                  </div>
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

export default Conversation;
