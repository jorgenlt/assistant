import { useMemo } from "react";
import copyToClipboard from "../../../common/utils/copyToClipboard";
import parseContent from "../utils/parseContent";
import CodeBlock from "./CodeBlock";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCopy } from "react-icons/fa6";

const AssistantMessage = ({ content }) => {
  const blocks = useMemo(() => parseContent(content), [content]);

  const handleCopyToClipboard = async (text) => await copyToClipboard(text);

  return (
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
  );
};

export default AssistantMessage;
