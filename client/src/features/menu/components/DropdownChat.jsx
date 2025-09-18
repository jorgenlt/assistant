import { useEffect, useRef } from "react";
import SidebarItem from "./SidebarItem";
import { FaTrashCan, FaXmark } from "react-icons/fa6";

const DropdownChat = ({ cancelDelete, confirmDelete }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        cancelDelete();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div
      ref={dropdownRef}
      className="absolute right-2 top-6 mt-2 py-2 z-20"
    >
      <div className="py-2 bg-[var(--bg2)] rounded-2xl">
        <SidebarItem title="Cancel" onClick={cancelDelete} Icon={FaXmark} />
        <SidebarItem title="Delete" onClick={confirmDelete} Icon={FaTrashCan} />
      </div>
    </div>
  );
};

export default DropdownChat;
