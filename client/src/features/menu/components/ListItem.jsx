import { FaTrashCan } from "react-icons/fa6";
import { PulseLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useState } from "react";
import DropdownChat from "./DropdownChat";

const ListItem = ({ action, title, id, isCurrent, onDelete }) => {
  const isThemeDark = useSelector((state) => state.menu.isThemeDark);
  const error = useSelector((state) => state.chat.error);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    onDelete(id);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return title ? (
    // Conversation
    <div className="relative">
      <div
        
        onClick={action}
        className={`${
          isCurrent ? "bg-[var(--hover)]/70  text-[var(--text-hover)]" : ""
        } group relative flex justify-between items-center gap-2 px-3 py-2 rounded-xl mx-2 cursor-pointer select-none hover:bg-[var(--hover)] hover:text-[var(--text-hover)]`}
      >
        <span className="text-sm truncate">{title}</span>

        <div
          onClick={handleDeleteClick}
          className="ml-2 p-1 cursor-pointer hidden group-hover:flex"
        >
          <FaTrashCan
            size={12}
            className="text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-400"
          />
        </div>
      </div>

      {showConfirm && (
        <DropdownChat
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete}
        />
      )}
    </div>
  ) : error ? (
    // Error message
    <div
      onClick={action}
      className="px-3 py-1 rounded-xl mx-2 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <span className="text-red-500 text-nowrap">{error}</span>
    </div>
  ) : (
    // Loader
    <div className="px-3 py-1 rounded-xl mx-2 cursor-default select-none">
      <PulseLoader size={5} color={isThemeDark ? "#fafafa" : "#121416"} />
    </div>
  );
}

export default ListItem;
