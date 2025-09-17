import { useEffect, useRef } from "react";
import Button from "../../../components/Button";

const DeleteModal = ({ cancelDelete, confirmDelete }) => {
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
      className="hover:text-[var(--text)] text-[var(--text)] absolute right-2 top-8 mt-2 bg-[var(--bg2)] rounded-xl shadow-lg z-20 p-2"
    >
      <div className="">
        <Button title="Cancel" onClick={cancelDelete} faIcon="FaXmark" />
        <Button title="Delete" onClick={confirmDelete} faIcon="FaTrashCan" />
      </div>
    </div>
  );
};

export default DeleteModal;
