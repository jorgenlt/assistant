import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice.js";
import { setIsSearchOpen, setIsMenuOpen } from "./menuSlice.js";
import { FaPenToSquare, FaMagnifyingGlass } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ConversationsList from "./ConversationsList.jsx";
import SidebarItem from "./components/SidebarItem.jsx";
import DropdownUser from "./components/DropdownUser.jsx";

const Menu = () => {
  const { isSearchOpen, isMobile } = useSelector((state) => state.menu);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const handleResetId = () => {
    dispatch(updateCurrentId(null));
    if (isMobile) dispatch(setIsMenuOpen(false));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const menuRef = useRef();

  useEffect(() => {
    if (isMobile) {
      const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          dispatch(setIsMenuOpen(false));
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dispatch, isMobile]);

  return (
    <div
      ref={menuRef}
      // className={`${
      //   isMobile ? "fixed h-screen z-10 w-4/5" : "w-1/5"
      // } py-2 flex flex-col bg-[var(--bg1)]`}
      className={`h-screen py-2 flex flex-col bg-[var(--bg1)]`}
    >
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
    </div>
  );
};

export default Menu;
