import { FaTrashCan } from "react-icons/fa6";
import { PulseLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useState } from "react";

function ListItem({ action, title, id, onDelete }) {
  const isThemeDark = useSelector((state) => state.menu.isThemeDark);
  const error = useSelector((state) => state.chat.error);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = async (e) => {
    e?.preventDefault?.();
    if (isDeleting) return;

    setIsDeleting(true);
    setShowConfirm(false);

    try {
      const result = onDelete?.(id);
      if (result && typeof result.then === "function") {
        await result;
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return title ? (
    <div
      className="group relative flex justify-between items-center gap-2 px-3 py-2 rounded-xl mx-2 cursor-pointer select-none hover:bg-[var(--hover)]"
      onClick={action}
    >
      <span className="text-sm font-medium truncate">{title}</span>

      <div
        onClick={handleDeleteClick}
        className="ml-2 p-1 cursor-pointer hidden group-hover:flex"
      >
        <FaTrashCan
          size={12}
          className="text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-400"
        />
      </div>

      {showConfirm && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg1)] rounded-xl shadow-lg z-20 p-3">
          <div className="text-sm mb-2">
            Are you sure you want to delete this conversation?
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={cancelDelete}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? <PulseLoader size={5} color="#fff" /> : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  ) : error ? (
    <div
      onClick={action}
      className="px-3 py-1 rounded-xl mx-2 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <span className="text-red-500 text-nowrap">{error}</span>
    </div>
  ) : (
    <div className="px-3 py-1 rounded-xl mx-2 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700">
      <PulseLoader size={5} color={isThemeDark ? "#fafafa" : "#121416"} />
    </div>
  );
}

export default ListItem;
