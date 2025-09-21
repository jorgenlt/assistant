import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice.js";
import { toggleTheme, setIsSearchOpen } from "./menuSlice.js";
import {
  FaPenToSquare,
  FaGear,
  FaMoon,
  FaSun,
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
  const isThemeDark = useSelector((state) => state.menu.isThemeDark);
  const isSearchOpen = useSelector((state) => state.menu.isSearchOpen);
  const user = useSelector((state) => state.auth.user);

  const [isThemeHover, setIsThemeHover] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          onClick={handleResetId}
          title="New Chat"
          Icon={FaPenToSquare}
        />
        <SidebarItem
          title="Search chats"
          onClick={() => dispatch(setIsSearchOpen(!isSearchOpen))}
          Icon={FaMagnifyingGlass}
        />
      </div>

      {/* Conversations list */}
      <div className="chat-list h-full flex flex-col overflow-y-auto">
        <div className="flex-1  border-t border-b border-[#83838326]">
          <ConversationsList />
        </div>
      </div>

      {/* Theme selector */}
      <div
        onMouseEnter={() => setIsThemeHover(true)}
        onMouseLeave={() => setIsThemeHover(false)}
      >
        <SidebarItem
          onClick={handleToggleTheme}
          title={isThemeHover ? theme : "Toggle Themes"}
          Icon={isThemeDark ? FaMoon : FaSun}
        />
      </div>

      {/* Settings */}
      <div className="hidden">
        <SidebarItem onClick={setIsModalOpen} title="Settings" Icon={FaGear} />
      </div>

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
        onClose={() => dispatch(setIsSearchOpen(false))}
      >
        <SearchChats onClose={() => dispatch(setIsSearchOpen(false))} />
      </Modal>
    </div>
  );
};

export default Menu;
