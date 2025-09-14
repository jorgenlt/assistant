import { useMemo, memo } from "react";
import copyToClipboard from "../../../common/utils/copyToClipboard";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCopy } from "react-icons/fa6";
import normalizeMarkdown from "../../../common/utils/normalizeMarkdown";

const UserMessage = ({ content }) => {
  const handleCopyToClipboard = async (text) => await copyToClipboard(text);

  const parsedContent = useMemo(() => normalizeMarkdown(content), [content]);

  return (
    <div className="group cursor-default max-w-[90%]">
      <div className="bg-[var(--bg-chat-bubble)] rounded-2xl py-2 pl-4 pr-2 rounded-tr-sm">
        <div className="prose prose-base max-w-full text-[var(--text-chat-bubble)]">
          <Markdown remarkPlugins={[remarkGfm]}>{parsedContent}</Markdown>
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
  );
};

export default memo(UserMessage);
