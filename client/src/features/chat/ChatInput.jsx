import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  getChatResponseThunk,
  addConversation,
  generateConversationTitleThunk,
} from "./chatSlice.js";
import { FaArrowUp, FaPaperclip } from "react-icons/fa6";
import axios from "axios";
import { BASE_API_URL } from "../../app/config.js";

const ChatInput = () => {
  const { name, model } = useSelector((state) => state.providers.current);
  const currentId = useSelector((state) => state.chat.currentId);
  const userId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.token);

  const [prompt, setPrompt] = useState("");

  const dispatch = useDispatch();

  const createConversation = async () => {
    try {
      const url = `${BASE_API_URL}/conversations`;
      const response = await axios.post(
        url,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        dispatch(addConversation(response.data));
      }
    } catch (err) {
      console.error("An error occurred:", err.message);
    }
  };

  const handleSendPrompt = async () => {
    if (prompt) {
      if (currentId === null) {
        await createConversation();
        dispatch(generateConversationTitleThunk(prompt));
      }

      dispatch(getChatResponseThunk(prompt));
      setPrompt("");
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
      {/* <div className="w-full md:w-3/5"> */}
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
};

export default ChatInput;
