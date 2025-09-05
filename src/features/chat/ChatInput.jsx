import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getChatResponseThunk,
  updateMessages,
  addConversation,
  resetChatSlice,
  setError,
} from "./chatSlice.js";
import { resetProviderSlice } from "../providers/providersSlice.js";
import { resetMenuSlice } from "../menu/menuSlice.js";
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
    if (prompt === "resetProviderSlice") {
      dispatch(resetProviderSlice());
      setPrompt("");
      return;
    }

    if (prompt === "resetChatSlice") {
      dispatch(resetChatSlice());
      setPrompt("");
      return;
    }

    if (prompt === "resetMenuSlice") {
      dispatch(resetMenuSlice());
      setPrompt("");
      return;
    }

    if (prompt === "resetAll") {
      dispatch(resetProviderSlice());
      dispatch(resetChatSlice());
      dispatch(resetMenuSlice());
      setPrompt("");
      return;
    }

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
      dispatch(setError(`API key for ${name} is missing`));
      console.error(`API key for ${name} is missing`);
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
            className="hidden active:scale-90 p-4 cursor-pointer text-gray-600 hover:text-gray-400"
          >
            <FaPaperclip className="size-6" />
          </div>

          {/* Input */}
          <textarea
            autoFocus
            ref={textareaRef}
            placeholder={`${name} (${model})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="chat-input-textarea max-h-[350px] overflow-y-auto flex-1 resize-none overflow-hidden rounded-4xl p-4 outline-none bg-[var(--bg3)] text-[var(--text)]"
            rows={1}
          />

          {/* Right actions */}
          <div
            onClick={handleSendPrompt}
            className="active:scale-95 p-4 bg-neutral-200 dark:bg-neutral-200 hover:bg-neutral-100 hover:dark:bg-neutral-50 rounded-4xl cursor-pointer"
          >
            <FaArrowUp className="size-6 text-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
