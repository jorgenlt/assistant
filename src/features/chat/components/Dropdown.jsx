import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModel, setProvider, addKey } from "../../providers/providersSlice";
import { FaChevronDown, FaCheck, FaGear } from "react-icons/fa6";
import Modal from "../../../components/Modal";

export default function Dropdown() {
  const { current, openAi, anthropic, mistral } = useSelector(
    (state) => state.providers
  );

  const providers = [openAi, anthropic, mistral];

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null); // null means no modal

  const handleSetModel = (provider, model) => {
    dispatch(setProvider({ provider }));
    dispatch(setModel({ provider, model }));
  };

  const [apiKey, setApiKey] = useState("");

  const handleAddKey = () => {
    dispatch(
      addKey({ provider: activeProvider.provider, apiKey: apiKey.trim() })
    );
    setApiKey("");
    setActiveProvider(null);
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
        className=" cursor-pointer select-none rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)] flex items-center py-2 my-2 mx-2 px-4"
      >
        <span className="mr-2">
          {current.name} ({current.model})
        </span>
        <FaChevronDown size={13} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="ml-2 absolute min-w-max *:left-0 origin-top-left divide-y rounded-xl shadow-lg bg-[var(--bg1)]">
          <div className="py-1">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="text-neutral-400 p-2 flex flex-col m-1 cursor-default select-none text-left"
              >
                <div className="flex items-center justify-between">
                  <span>{provider.name}</span>
                  <div
                    onClick={() => setActiveProvider(provider)}
                    className="cursor-pointer select-none p-3 rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
                  >
                    <FaGear />
                  </div>
                </div>

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

      {activeProvider && (
        <Modal
          open={activeProvider}
          onClose={() => setActiveProvider(null)}
          title={`Set API key for ${activeProvider.name}`}
        >
          <form className="space-y-4">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={activeProvider.key ? activeProvider.key : "Enter your API key"}
              
              className="w-full rounded-xl px-3 py-2 text-sm outline-none bg-[var(--bg3)] text-[var(--text)]"
              required
            />
            <div className="flex justify-end gap-2">
              <div
                onClick={() => setActiveProvider(null)}
                className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
              >
                Cancel
              </div>
              <div
                onClick={handleAddKey}
                className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-white bg-[var(--bg2)] hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
              >
                Save
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
