import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../sidebarSlice";
import {
  FaRightFromBracket,
  FaUser,
  FaKeyboard,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import SidebarItem from "./SidebarItem";
import { setIsKeyboardShortcutsOpen } from "../sidebarSlice";
import useClickOutside from "../../../hooks/useClickOutside";

const DropdownUser = ({ user, logout }) => {
  const theme = useSelector((state) => state.sidebar.theme);
  const isThemeDark = useSelector((state) => state.sidebar.isThemeDark);

  const [isOpen, setIsOpen] = useState(false);
  const [isThemeHover, setIsThemeHover] = useState(false);

  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleOpenKeyboardShortcuts = () => {
    dispatch(setIsKeyboardShortcutsOpen(true));
    setIsOpen(false);
  };

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef} className="relative">
      <SidebarItem
        onClick={() => setIsOpen(!isOpen)}
        title={`${user.firstName} ${user.lastName}`}
        Icon={FaUser}
      />
      {isOpen && (
        <div className="absolute bottom-8 left-0 p-2">
          <div className="py-2 rounded-2xl bg-[var(--bg2)] min-w-40">
            <SidebarItem
              title="Keyboard shortcuts"
              Icon={FaKeyboard}
              onClick={handleOpenKeyboardShortcuts}
            />
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
            <SidebarItem
              title="Logout"
              Icon={FaRightFromBracket}
              onClick={logout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
