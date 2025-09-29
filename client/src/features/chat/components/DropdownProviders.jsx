import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa6";
import SetApiKeyModal from "./SetApiKeyModal";
import DropdownProvidersMenu from "./DropdownProvidersMenu";
import useClickOutside from "../../../hooks/useClickOutside";
import { BASE_API_URL } from "../../../app/config";
import axios from "axios";

const DropdownProviders = () => {
  const current = useSelector((state) => state.providers.current);
  const isMobile = useSelector((state) => state.menu.isMobile);
  const { token, user } = useSelector((state) => state.auth);

  const userId = user._id;

  const [activeProvider, setActiveProvider] = useState(null); // null means no modal
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
    if (isOpen === false) {
      hasApiKeys(userId, token);
    }
  };

  const hasApiKeys = async (userId, token) => {
    try {
      const url = `${BASE_API_URL}/users/${userId}/apiKeys/hasapikeys`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApiKeys(response.data);
    } catch (error) {
      console.error(error);
    }
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
