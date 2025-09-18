import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa6";
import SidebarItem from "./SidebarItem";

import Button from "../../../components/Button";
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
        action={() => setIsOpen(!isOpen)}
        title={`${user.firstName} ${user.lastName}`}
        Icon={FaUser}
      />
      {isOpen && (
        <div className="absolute bottom-10 left-2 p-2 rounded-xl bg-[var(--bg2)]">
          <Button title="Logout" faIcon="FaRightFromBracket" onClick={logout} />
          <Button title="Logout" faIcon="FaRightFromBracket" onClick={logout} />
          <Button title="Logout" faIcon="FaRightFromBracket" onClick={logout} />
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
