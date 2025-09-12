import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDate } from "../../common/utils/formatDate.js";
import { PropagateLoader } from "react-spinners"; // loader
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCopy } from "react-icons/fa6";
import CodeBlock from "./components/CodeBlock";
import normalizeMarkdown from "../../common/utils/normalizeMarkdown";

const Conversation = () => {
  const { currentId, conversations, error, status } = useSelector(
    (state) => state.chat
  );

  const isThemeDark = useSelector((state) => state.menu).isThemeDark;

  const conversation = conversations?.find((c) => c._id === currentId);
  const messages = conversation?.messages ?? [];

  // Copy message to clipboard
  const handleCopyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      alert("Failed to copy: " + err.message);
    }
  };

  const parseContent = (content) => {
    const parts = content.split(/```/);
    const result = [];

    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        // it's a code block
        const lines = part.split("\n");
        const lang = lines[0].trim();
        const code = lines.slice(1).join("\n");
        result.push({ type: "code", lang, code });
      } else {
        // it's normal markdown text
        result.push({ type: "text", text: part });
      }
    });

    return result;
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
      <div className="px-2 w-3/5 flex flex-col">
        {messages?.map((message, i) => {
          const { created, content, role } = message;
          const blocks = parseContent(content);

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
                  <div className="cursor-default max-w-full">
                    <div className="prose prose-base dark:prose-invert max-w-full">
                      {blocks.map((block, i) =>
                        block.type === "code" ? (
                          <CodeBlock
                            key={i}
                            code={block.code}
                            lang={block.lang}
                            onCopy={() => handleCopyToClipboard(block.code)}
                          />
                        ) : (
                          <Markdown key={i} remarkPlugins={[remarkGfm]}>
                            {block.text}
                          </Markdown>
                        )
                      )}
                    </div>
                    <div
                      onClick={() => handleCopyToClipboard(content)}
                      className="active:scale-90 mt-3 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
                    >
                      <FaCopy size={16} />
                    </div>
                  </div>
                ) : (
                  // User
                  <div className="group cursor-default max-w-[90%]">
                    <div className="bg-[var(--bg-chat-bubble)] rounded-2xl py-2 pl-4 pr-2 rounded-tr-sm">
                      <div className="prose prose-base max-w-full text-[var(--text-chat-bubble)]">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {normalizeMarkdown(content)}
                        </Markdown>
                      </div>
                    </div>
                    <div className="w-full flex justify-end mt-3">
                      <button
                        onClick={() => handleCopyToClipboard(content)}
                        className="active:scale-90 p-1.5 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] opacity-0 group-hover:opacity-100 transition"
                      >
                        <FaCopy size={16} />
                      </button>
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
