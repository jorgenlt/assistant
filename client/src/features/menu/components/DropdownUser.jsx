import { useEffect, useRef, useState } from "react";
import { FaRightFromBracket, FaUser, FaKeyboard } from "react-icons/fa6";
import SidebarItem from "./SidebarItem";
import KeyboardShortcuts from "./KeyboardShortcuts";
import Modal from "../../../components/Modal";

const DropdownUser = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleOpenKeyboardShortcuts = () => {
    setIsKeyboardShortcutsOpen(true);
    setIsOpen(false);
  };

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
            <SidebarItem
              title="Logout"
              Icon={FaRightFromBracket}
              onClick={logout}
            />
          </div>
        </div>
      )}

      {/* Keyboard shortcuts */}
      <Modal
        title="Keyboard shortcuts"
        open={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
      >
        <KeyboardShortcuts />
      </Modal>
    </div>
  );
};

export default DropdownUser;
