import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModel, setProvider } from "../../providers/providersSlice";
import { FaChevronDown, FaCheck, FaGear } from "react-icons/fa6";
import DropdownProvidersModal from "./DropdownProvidersModal";

const DropdownProviders = () => {
  const { current, openAi, anthropic, mistral } = useSelector(
    (state) => state.providers
  );
  const isMobile = useSelector((state) => state.menu.isMobile);

  const [isOpen, setIsOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null); // null means no modal

  const providers = [openAi, anthropic, mistral];

  const dispatch = useDispatch();

  const handleSetModel = (provider, model) => {
    dispatch(setProvider({ provider }));
    dispatch(setModel({ provider, model }));
    setIsOpen(false);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Dropdown button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] flex items-center py-2 my-2 mx-2 px-4"
      >
        <span className="mr-2">
          {current.name} {!isMobile ? `(${current.model})` : ""}
        </span>
        <FaChevronDown size={13} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="ml-2 absolute z-10 min-w-max *:left-0 origin-top-left divide-y rounded-xl shadow-lg bg-[var(--bg1)]">
          <div className="py-1">
            {/* Providers */}
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="text-neutral-400 p-2 flex flex-col m-1 cursor-default select-none text-left"
              >
                <div className="flex items-center justify-between">
                  <span>{provider.name}</span>
                  <div
                    onClick={() => setActiveProvider(provider)}
                    className="cursor-pointer select-none p-2 rounded-full hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
                  >
                    <FaGear />
                  </div>
                </div>

                {/* Models */}
                {provider.models.map((model) => (
                  <div
                    key={model}
                    onClick={() => handleSetModel(provider.provider, model)}
                    className="text-[var(--text)] p-2 flex items-center justify-between m-1 cursor-pointer select-none rounded-xl text-left hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
                  >
                    {model}{" "}
                    {current.model === model && (
                      <div className="pl-2">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {activeProvider && (
        <DropdownProvidersModal
          open={activeProvider}
          onClose={() => setActiveProvider(null)}
          activeProvider={activeProvider}
        />
      )}
    </div>
  );
};

export default DropdownProviders;
