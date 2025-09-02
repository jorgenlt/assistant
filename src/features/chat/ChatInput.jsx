import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getChatResponseThunk,
  updateMessages,
  addConversation,
} from "./chatSlice.js";
import { FaArrowUp, FaPaperclip } from "react-icons/fa6";

function ChatInput() {
  const {
    provider: currentProvider,
    name,
    model,
  } = useSelector((state) => state.providers.current);

  const key = useSelector((state) => state.providers[currentProvider].key);

  const currentId = useSelector((state) => state.chat.currentId);

  const [prompt, setPrompt] = useState("");

  const dispatch = useDispatch();

  const handleSendPrompt = () => {
    if (key) {
      if (prompt) {
        if (currentId === null) {
          dispatch(addConversation());
        }
        dispatch(getChatResponseThunk(prompt));
        setPrompt("");

        dispatch(
          updateMessages({
            content: prompt.trim(),
            role: "user",
          })
        );
      }
    } else {
      console.error("API key is missing");
    }
  };

  const handleKeyDown = (e) => {
    // Detect Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault(); // prevents newline in textarea
      handleSendPrompt();
    }
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [prompt]);

  return (
    <div className="flex-shrink-0 mb-2 ml-2 mr-4 flex justify-center">
      <div className="w-3/5">
        <div className="p-3 flex items-end gap-2">
          {/* Left action */}
          <div
            onClick={() => console.log("Attach file")}
            className="p-4 cursor-pointer text-gray-600 hover:text-gray-400"
          >
            <FaPaperclip className="size-6" />
          </div>

          {/* Input */}
          <textarea
            ref={textareaRef}
            placeholder={`${name} (${model})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="chat-input-textarea max-h-[350px] overflow-y-auto flex-1 resize-none overflow-hidden rounded-4xl p-4 outline-none bg-[var(--bg3)] text-[var(--text)]"
            rows={1}
          />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
            >
              Dictate
            </button>
            <div
              onClick={handleSendPrompt}
              className="p-4 bg-neutral-200 dark:bg-neutral-200 hover:bg-neutral-100 hover:dark:bg-neutral-50 rounded-4xl cursor-pointer"
            >
              <FaArrowUp className="size-6 text-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
