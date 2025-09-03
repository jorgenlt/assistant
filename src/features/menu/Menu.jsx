import { FaPenToSquare, FaGear, FaMoon, FaArrowRight } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ChatList from "./ChatList.jsx";
import { updateCurrentId } from "../chat/chatSlice.js";
import { toggleTheme } from "./menuSlice.js";
import { useDispatch } from "react-redux";
import SidebarItem from "../../components/SidebarItem.jsx";

function Menu() {
  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleResetId = () => {
    dispatch(updateCurrentId(null));
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
      <div className="chat-list flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-y-auto border-t border-b border-[#83838326]">
          <ChatList />
        </div>
      </div>

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
