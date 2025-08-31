import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { getChatResponseThunk, updateMessages } from "./chatSlice.js";

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
    <div className="flex-shrink-0 mb-2 ml-2 mr-4">

      <div
        className="w-full bg-white dark:bg-gray-800 shadow-md rounded-2xl p-3 grid grid-cols-[auto_1fr_auto] gap-2 items-center"
      >
        {/* Left action */}
        <button
          type="button"
          className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
        >
          Add
        </button>

        {/* Input */}
        <textarea
        placeholder={`${name} (${model})`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full resize-none rounded-md p-2 bg-transparent outline-none text-gray-900 dark:text-gray-100"
          rows={1}
        />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
          >
            Dictate
          </button>
          <button
            onClick={handleSendPrompt}
            className="px-3 py-1 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          >
            Send
          </button>
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
