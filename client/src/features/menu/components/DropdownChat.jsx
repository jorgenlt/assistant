import { useEffect, useRef, useState } from "react";
import SidebarItem from "./SidebarItem";
import { FaTrashCan, FaXmark } from "react-icons/fa6";

const DropdownChat = ({ cancelDelete, confirmDelete }) => {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState("top");

  useEffect(() => {
    const updatePosition = () => {
      const el = dropdownRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const isBottom = rect.top > window.innerHeight * 0.75;
        setPosition(isBottom ? "bottom" : "top");
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

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
      className={`absolute right-2 mt-2 py-2 z-10 opacity-0 fade-in ${
        position === "bottom" ? "bottom-8" : "top-6"
      }`}
    >
      <div className="py-2 bg-[var(--bg1)] md:bg-[var(--bg2)] rounded-2xl">
        <SidebarItem title="Cancel" onClick={cancelDelete} Icon={FaXmark} />
        <SidebarItem title="Delete" onClick={confirmDelete} Icon={FaTrashCan} />
      </div>
    </div>
  );
};

export default DropdownChat;
