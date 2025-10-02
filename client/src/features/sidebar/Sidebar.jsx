import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice.js";
import { setIsSearchOpen, setIsSidebarOpen } from "./sidebarSlice.js";
import { FaPenToSquare, FaMagnifyingGlass } from "react-icons/fa6";
import SidebarHeader from "./SidebarHeader.jsx";
import ConversationsList from "./ConversationsList.jsx";
import SidebarItem from "./components/SidebarItem.jsx";
import DropdownUser from "./components/DropdownUser.jsx";

const Sidebar = () => {
  const { isSearchOpen, isMobile } = useSelector((state) => state.sidebar);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const handleResetId = () => {
    dispatch(updateCurrentId(null));
    if (isMobile) dispatch(setIsSidebarOpen(false));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const ref = useRef();

  useEffect(() => {
    if (isMobile) {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          dispatch(setIsSidebarOpen(false));
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dispatch, isMobile]);

  return (
    <div ref={ref} className={`h-dvh py-2 flex flex-col bg-[var(--bg1)]`}>
      {/* Header */}
      <SidebarHeader action={handleResetId} />

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

export default Sidebar;
