import { FaPenToSquare, FaGear, FaMoon, FaArrowRight } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ChatList from "./ChatList.jsx";
import { updateCurrentId } from "../chat/chatSlice.js";
import { addKey } from "../providers/providersSlice.js";
import { toggleTheme } from "./menuSlice.js";
import { useDispatch, useSelector } from "react-redux";
import SidebarItem from "../../components/SidebarItem.jsx";

function Menu() {
  const { provider: currentProvider } = useSelector(
    (state) => state.providers.current
  );

  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleResetId = () => {
    dispatch(updateCurrentId(null));
  };

  const setApi = async () => {
    const apiKey = await navigator.clipboard.readText();
    dispatch(addKey({ provider: currentProvider, apiKey: apiKey.trim() }));
  };

  return (
    <div className="py-2 flex flex-col w-1/5 bg-[var(--bg1)] text-[var(--text)]">
      <MenuHeader action={handleResetId} />

      <div className="mb-4">
        <SidebarItem
          action={handleResetId}
          title="New Chat"
          Icon={FaPenToSquare}
        />
      </div>

      {/* Chats */}
      <div className="chat-list flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex-1 overflow-y-auto border-t border-b border-[#83838326]">
          <ChatList />
        </div>
      </div>

      <SidebarItem action={setApi} title="Set API Key" Icon={FaArrowRight} />
      <SidebarItem
        action={handleToggleTheme}
        title="Toggle Theme"
        Icon={FaMoon}
      />
      <SidebarItem
        action={() => console.log("Settings clicked")}
        title="Settings"
        Icon={FaGear}
      />
    </div>
  );
}

export default Menu;
