import { useEffect, useRef } from "react";
import { FaX } from "react-icons/fa6";

function Modal({ open, onClose, title = "Simple Modal", children }) {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Focus the close button when modal opens
  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-md rounded-2xl bg-[var(--bg1)] p-6 shadow-xl outline-none transition-all"
      >
        <div className="flex justify-end">
          <div
            ref={closeBtnRef}
            onClick={onClose}
            className="w-fit cursor-pointer select-none p-3 rounded-xl hover:bg-[var(--hover)]"
          >
            <FaX />
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-semibold tracking-tight">
            {title}
          </h2>
        </div>

        <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
          {children ?? (
            <p>
              This is a simple modal. Click outside, press <kbd>Esc</kbd>, or
              hit Close to dismiss it.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:shadow-md dark:bg-gray-100 dark:text-gray-900"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
