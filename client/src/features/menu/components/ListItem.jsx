import { FaTrashCan } from "react-icons/fa6";
import { PulseLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { memo, useState } from "react";
import DropdownChat from "./DropdownChat";

const ListItem = memo(
  ({ action, title, id, isCurrent, onDelete, isMobile }) => {
    const isThemeDark = useSelector((state) => state.menu.isThemeDark);
    const error = useSelector((state) => state.chat.error);
    const [showConfirm, setShowConfirm] = useState(false);

    const confirmDelete = () => {
      setShowConfirm(false);
      onDelete(id);
    };

    return title ? (
      // Conversation
      <div className="relative">
        <div
          className={`${
            isCurrent ? "bg-[var(--hover)]/70  text-[var(--text-hover)]" : ""
          } group relative flex justify-between items-center   rounded-xl mx-2 cursor-pointer select-none hover:bg-[var(--hover)] hover:text-[var(--text-hover)]`}
        >
          <span onClick={action} className="px-3 py-2 w-full text-sm truncate">
            {title}
          </span>

          {!isMobile && (
            <div
              onClick={() => setShowConfirm(true)}
              className="cursor-pointer mr-3 hidden  group-hover:flex text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-400"
            >
              <FaTrashCan size={12} className="" />
            </div>
          )}
        </div>

        {showConfirm && (
          <DropdownChat
            cancelDelete={() => setShowConfirm(false)}
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
);

export default ListItem;
