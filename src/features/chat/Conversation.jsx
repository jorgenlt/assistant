import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../common/utils/formatDate.js";
import { PropagateLoader } from "react-spinners"; // loader
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Conversation = () => {
  const { currentId, conversations, error, status } = useSelector(
    (state) => state.chat
  );

  const theme = useSelector((state) => state.menu.theme);

  // const { currentId, conversations, error, status, theme, largeText } =
  //   useSelector((state) => state.chat);

  const [prevStatus, setPrevStatus] = useState(status);

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

  // Monitor status changes
  useEffect(() => {
    if (prevStatus === "loading" && status === "idle") {
      console.log("Status changed: loading → idle");
    }
    setPrevStatus(status);
  }, [status, prevStatus]);

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
                <div
                  className={`cursor-default ${
                    role === "assistant"
                      ? "max-w-full"
                      : "bg-gray-200 dark:bg-gray-700 rounded-2xl py-2 pl-4 pr-2 rounded-tr-sm max-w-[90%]"
                  }`}
                  // onClick={() => handleCopyToClipboard(content)}
                >
                  {/* Message content */}
                  <div className="prose prose-base dark:prose-invert max-w-full">
                    <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                  </div>
                </div>
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
                color={theme === "light" ? "#1c1f22" : "#f5f5f5"}
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
