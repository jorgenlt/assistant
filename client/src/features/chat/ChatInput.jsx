import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getChatResponseThunk,
  generateConversationTitleThunk,
  createConversationThunk,
} from "./chatThunks.js";
import { FaArrowUp, FaPaperclip } from "react-icons/fa6";

const ChatInput = ({ autoFocus }) => {
  const { name, model } = useSelector((state) => state.providers.current);
  const currentId = useSelector((state) => state.chat.currentId);

  const [prompt, setPrompt] = useState("");

  const dispatch = useDispatch();

  const handleSendPrompt = async () => {
    if (!prompt) return;
    setPrompt("");

    try {
      if (currentId === null) {
        await dispatch(createConversationThunk()).unwrap();

        await Promise.all([
          dispatch(generateConversationTitleThunk(prompt)).unwrap(),
          dispatch(getChatResponseThunk(prompt)).unwrap(),
        ]);
      } else {
        await dispatch(getChatResponseThunk(prompt)).unwrap();
      }
    } catch (err) {
      console.error("Error handling prompt:", err);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSendPrompt();
      return;
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
    <div className="flex-shrink-0 mb-2 md:ml-2 md:mr-4 flex justify-center">
      <div className="w-full md:max-w-3xl">
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
            autoFocus={autoFocus}
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
};

export default ChatInput;
