import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { getChatResponseThunk, updateMessages } from "./chatSlice.js";

function ChatInput() {
  const {
    provider: currentProvider,
    name,
    model,
  } = useSelector((state) => state.chat.providers.current);
  
  console.log("chatinput rendered");
  console.log(currentProvider, name, model)

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
    <div className="chat-input">
      <textarea 
        id="chat-input"
        name="chat-input" 
        placeholder={`${name} (${model})`}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        cols="40" 
        rows="5"
        wrap="soft"
        autofocus="true"


      ></textarea>
      <button>Send</button>
    </div>
  );
}

export default ChatInput;
