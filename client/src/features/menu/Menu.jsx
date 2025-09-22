import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice.js";
import { setIsSearchOpen } from "./menuSlice.js";
import { FaPenToSquare, FaGear, FaMagnifyingGlass } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ConversationsList from "./ConversationsList.jsx";
import SidebarItem from "./components/SidebarItem.jsx";
import Modal from "../../components/Modal.jsx";
import SearchChats from "./components/SearchChats.jsx";
import DropdownUser from "./components/DropdownUser.jsx";

const Menu = () => {
  const isSearchOpen = useSelector((state) => state.menu.isSearchOpen);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

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

      {/* New Chat & Search Chats */}
      <div className="border-b border-[#83838326]">
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
        <div className="flex-1">
          <ConversationsList />
        </div>
      </div>

      {/* Profile & settings */}
      <div className="border-t border-[#83838326]">
        <DropdownUser user={user} logout={handleLogout} />
      </div>

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
