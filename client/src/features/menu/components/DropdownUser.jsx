import { useEffect, useRef, useState } from "react";
import { FaRightFromBracket, FaUser } from "react-icons/fa6";
import SidebarItem from "./SidebarItem";

const DropdownUser = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);

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
              title="Logout"
              Icon={FaRightFromBracket}
              onClick={logout}
            />
            <SidebarItem
              title="Logout"
              Icon={FaRightFromBracket}
              onClick={logout}
            />
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
