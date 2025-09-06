import { useEffect, useRef } from "react";

function DeleteModal({ cancelDelete, confirmDelete }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        cancelDelete();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cancelDelete]);

  return (
    <div
      ref={modalRef}
      className="hover:text-[var(--text)] text-[var(--text)] absolute left-2 top-7 mt-2 w-48 bg-[var(--bg2)] rounded-xl shadow-lg z-20 p-3"
    >
      <div className="text-sm mb-2">
        Delete conversation?
      </div>
      <div className="flex justify-end space-x-2">
        <div
          onClick={cancelDelete}
          className="cursor-pointer rounded-xl px-4 py-2 text-sm hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
        >
          Cancel
        </div>
        <div
          onClick={confirmDelete}
          className="cursor-pointer rounded-xl px-4 py-2 text-sm bg-[var(--bg1)] hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
        >
          Delete
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
