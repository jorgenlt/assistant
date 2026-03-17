import { useMemo, memo, useState, useEffect } from "react";
import copyToClipboard from "../../../common/utils/copyToClipboard";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaCopy,
  FaGoogle,
  FaReddit,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { SiDuckduckgo } from "react-icons/si";
import normalizeMarkdown from "../../../common/utils/normalizeMarkdown";

// Collapsed usermessages
const LONG_TEXT_THRESHOLD = 600;
const MAX_COLLAPSED_HEIGHT = 160;

const UserMessage = ({ content }) => {
  const handleCopyToClipboard = async (text) => await copyToClipboard(text);

  const parsedContent = useMemo(() => normalizeMarkdown(content), [content]);

  // Determine if content is long and manage collapsed state
  const isLong = (parsedContent ?? "").length > LONG_TEXT_THRESHOLD;
  const [collapsed, setCollapsed] = useState(true);

  // Reset collapsed state when new content arrives
  useEffect(() => {
    setCollapsed(true);
  }, [content]);

  return (
    <div className="group cursor-default max-w-[90%]">
      <div className="flex justify-end">
        <div
          className="bg-[var(--bg-chat-bubble)] rounded-2xl py-2 px-4 rounded-tr-sm"
          style={{ position: "relative" }}
        >
          <div
            className="prose prose-base text-[var(--text-chat-bubble)]"
            style={
              collapsed && isLong
                ? { maxHeight: MAX_COLLAPSED_HEIGHT, overflow: "hidden" }
                : {}
            }
          >
            <Markdown remarkPlugins={[remarkGfm]}>{parsedContent}</Markdown>
          </div>

          {isLong && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="text-sm text-[var(--text2-chat-bubble)] hover:text-[var(--text-chat-bubble)]"
                aria-label={collapsed ? "Show more" : "Show less"}
              >
                {collapsed ? "Show more" : "Show less"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-end mt-3 space-x-1">
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(parsedContent)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open search in new window"
          className="active:scale-90 p-1.5 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] opacity-0 group-hover:opacity-100 transition"
        >
          <FaYoutube size={20} />
        </a>
        <a
          href={`https://x.com/search?q=${encodeURIComponent(parsedContent)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open search in new window"
          className="active:scale-90 p-1.5 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] opacity-0 group-hover:opacity-100 transition"
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href={`https://www.reddit.com/search/?q=${encodeURIComponent(parsedContent)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open search in new window"
          className="active:scale-90 p-1.5 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] opacity-0 group-hover:opacity-100 transition"
        >
          <FaReddit size={20} />
        </a>
        <a
          href={`https://google.com/search?q=${encodeURIComponent(parsedContent)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open search in new window"
          className="active:scale-90 p-1.5 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] opacity-0 group-hover:opacity-100 transition"
        >
          <FaGoogle size={20} />
        </a>
        <a
          href={`https://duckduckgo.com/?q=${encodeURIComponent(parsedContent)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open search in new window"
          className="active:scale-90 p-1.5 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] opacity-0 group-hover:opacity-100 transition"
        >
          <SiDuckduckgo size={22} />
        </a>
        <button
          onClick={() => handleCopyToClipboard(content)}
          className="active:scale-90 p-1.5 px-2.5 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] opacity-0 group-hover:opacity-100 transition"
        >
          <FaCopy size={16} />
        </button>
      </div>
    </div>
  );
};

export default memo(UserMessage);
