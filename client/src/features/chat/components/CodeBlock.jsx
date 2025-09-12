import { FaCopy } from "react-icons/fa6";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ code, lang, onCopy }) => (
  <div className="relative group my-3">
    <SyntaxHighlighter
      language={lang}
      style={okaidia}
      customStyle={{ background: "#121416" }}
    >
      {code}
    </SyntaxHighlighter>
    <button
      onClick={() => onCopy(code)}
      className="active:scale-90 absolute top-2 right-2 p-1.5 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)] text-gray-300 hover:text-[var(--text-hover)] opacity-0 group-hover:opacity-100 transition"
    >
      <FaCopy size={16} />
    </button>
  </div>
);

export default CodeBlock;
