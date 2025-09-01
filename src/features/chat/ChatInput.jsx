import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { getChatResponseThunk, updateMessages } from "./chatSlice.js";
import { FaArrowUp, FaPaperclip } from "react-icons/fa6";

function ChatInput() {
  const {
    provider: currentProvider,
    name,
    model,
  } = useSelector((state) => state.chat.providers.current);

  const key = useSelector((state) => state.chat.providers[currentProvider].key);

  const [prompt, setPrompt] = useState("");

  const dispatch = useDispatch();

  const handleSendPrompt = () => {
    if (key) {
      if (prompt) {
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

  return (
    <div className="flex-shrink-0 mb-2 ml-2 mr-4 flex justify-center">
      <div className="w-3/5">
        <div className="dark:bg-gray-800 p-3 grid grid-cols-[auto_1fr_auto] gap-2 items-center">
          {/* Left action */}
          <FaPaperclip className="size-6 text-gray-600 cursor-pointer hover:text-gray-400" />

          {/* Input */}
          <textarea
            placeholder={`${name} (${model})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full resize-none rounded-4xl p-4 outline-none bg-neutral-200 text-gray-900 dark:text-gray-100 dark:bg-gray-700"
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

      {/* <div className="flex flex-col gap-2 mx-3">
        <textarea
          id="chat-input"
          name="chat-input"
          placeholder={`${name} (${model})`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          cols="40"
          rows="5"
          wrap="soft"
          autoFocus={true}
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white text-gray-900"
        ></textarea>
        <button
          onClick={handleSendPrompt}
          className="self-end px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div> */}
    </div>
  );
}

export default ChatInput;
