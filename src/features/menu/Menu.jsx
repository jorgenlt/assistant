import { FaPenToSquare, FaGear } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ChatList from "./ChatList.jsx";
import { addConversation, addKey } from "../chat/chatSlice.js";
import { toggleTheme } from "./menuSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

function Menu() {
  const [apiKey, setApiKey] = useState("");

  const { provider: currentProvider } = useSelector(
    (state) => state.chat.providers.current
  );

  const dispatch = useDispatch();

  const handleNewChat = () => {
    dispatch(addConversation());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  }

  return (
    <div className="flex flex-col justify-between h-screen w-1/5  bg-neutral-100 dark:bg-gray-900 text-gray-900 dark:text-neutral-50">
      <div>
        <MenuHeader />
        <div
          className="flex items-center gap-2 m-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md"
          onClick={handleNewChat}
        >
          <FaPenToSquare /> New Chat
        </div>
        <ChatList />
      </div>
      <div>
        <div className="flex flex-col border p-2">
          <input
            type="text"
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            onClick={() => {
              dispatch(
                addKey({ provider: currentProvider, apiKey: apiKey.trim() })
              );
              setApiKey("");
            }}
            className="px-3 py-1 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          >
            Save API Key
          </button>
        </div>

        <div>
          <button onClick={handleToggleTheme} className="px-3 py-1 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">

            Toggle Dark Mode
          </button>
        </div>




        <div className="flex items-center gap-2 m-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md">
          <FaGear /> Settings
        </div>
      </div>
    </div>
  );
}

export default Menu;
