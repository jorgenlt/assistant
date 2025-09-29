import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa6";
import SetApiKeyModal from "./SetApiKeyModal";
import DropdownProvidersMenu from "./DropdownProvidersMenu";
import useClickOutside from "../../../hooks/useClickOutside";

const DropdownProviders = () => {
  const current = useSelector((state) => state.providers.current);
  const isMobile = useSelector((state) => state.menu.isMobile);
  const apiKeys = useSelector((state) => state.auth.user.apiKeys);

  const [activeProvider, setActiveProvider] = useState(null); // null means no modal
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Dropdown button */}
      <button
        onClick={handleOpenModal}
        className="cursor-pointer select-none rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] flex items-center py-2 my-2 mx-2 px-4"
      >
        <span className="mr-2">
          {current.name} {!isMobile ? `(${current.model})` : ""}
        </span>
        <FaChevronDown size={13} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <DropdownProvidersMenu
          setActiveProvider={setActiveProvider}
          setIsOpen={setIsOpen}
          apiKeys={apiKeys}
        />
      )}

      {/* Modal */}
      {activeProvider && (
        <SetApiKeyModal
          open={activeProvider}
          onClose={() => setActiveProvider(null)}
          activeProvider={activeProvider}
          apiKeys={apiKeys}
        />
      )}
    </div>
  );
};

export default DropdownProviders;
