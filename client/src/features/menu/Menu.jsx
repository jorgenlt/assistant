import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice.js";
import { toggleTheme } from "./menuSlice.js";
import {
  FaPenToSquare,
  FaGear,
  FaMoon,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ConversationsList from "./ConversationsList.jsx";
import SidebarItem from "./components/SidebarItem.jsx";
import Modal from "../../components/Modal.jsx";
import SearchChats from "./components/SearchChats.jsx";
import DropdownUser from "./components/DropdownUser.jsx";

const Menu = () => {
  const theme = useSelector((state) => state.menu.theme);
  const user = useSelector((state) => state.auth.user);

  const [isThemeHover, setIsThemeHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleResetId = () => {
    dispatch(updateCurrentId(null));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="py-2 flex flex-col w-1/5 bg-[var(--bg1)]">
      {/* Header */}
      <MenuHeader action={handleResetId} />

      {/* Sidebar */}
      <div className="mb-4">
        <SidebarItem
          action={handleResetId}
          title="New Chat"
          Icon={FaPenToSquare}
        />
        <SidebarItem
          title="Search chats"
          action={setIsSearchOpen}
          Icon={FaMagnifyingGlass}
        />
      </div>

      {/* Conversations list */}
      <div className="chat-list flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-y-auto border-t border-b border-[#83838326]">
          <ConversationsList />
        </div>
      </div>

      {/* Theme selector */}
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

      {/* Settings */}
      <SidebarItem action={setIsModalOpen} title="Settings" Icon={FaGear} />

      {/* Profile */}
      <DropdownUser user={user} logout={handleLogout} />

      {/* Settings modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Settings"
      >
        <div className="flex flex-col">
          <div onClick={handleLogout}>Log out</div>
          <div>Setting 3</div>
          <div>Setting 4</div>
        </div>
      </Modal>

      {/* Search modal */}
      <Modal
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search chats"
      >
        <SearchChats />
      </Modal>
    </div>
  );
};

export default Menu;
