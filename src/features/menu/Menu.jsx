import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice.js";
import { toggleTheme } from "./menuSlice.js";
import { FaPenToSquare, FaGear, FaMoon } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ChatList from "./ChatList.jsx";
import SidebarItem from "./components/SidebarItem.jsx";
import Modal from "../../components/Modal.jsx";

function Menu() {
  const theme = useSelector((state) => state.menu.theme);
  const [isThemeHover, setIsThemeHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <div
        onMouseEnter={() => setIsThemeHover(true)}
        onMouseLeave={() => setIsThemeHover(false)}
      >
        <SidebarItem
          action={handleToggleTheme}
          title={isThemeHover ? theme : "Toggle Themes"}
          Icon={FaMoon}
        />
      </div>
      <SidebarItem
        action={() => setIsModalOpen(true)}
        title="Settings"
        Icon={FaGear}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Settings"
      >
        <div className="flex flex-col">
          <div>Setting 1</div>
          <div>Setting 2</div>
          <div>Setting 3</div>
          <div>Setting 4</div>
        </div>
      </Modal>
    </div>
  );
}

export default Menu;
