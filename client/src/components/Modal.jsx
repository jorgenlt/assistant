import { useEffect, useRef } from "react";
import { FaX } from "react-icons/fa6";

function Modal({ open, onClose, title, children }) {
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-white/10 "
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative min-w-md rounded-2xl bg-[var(--bg1)] shadow-xl outline-none transition-all"
      >
        <div className="absolute right-3 top-3">
          <div
            onClick={onClose}
            className="w-fit cursor-pointer select-none p-2 rounded-full hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
          >
            <FaX size={14} />
          </div>
        </div>
        {title && (
          <div className="flex items-start justify-between gap-4 p-4">
            <h2 id="modal-title" className="text-lg font-medium">
              {title}
            </h2>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
