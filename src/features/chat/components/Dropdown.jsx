import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModel, setProvider } from "../../providers/providersSlice";
import { FaChevronDown, FaCheck } from "react-icons/fa6";

export default function Dropdown() {
  const { current, openAi, anthropic, mistral } = useSelector(
    (state) => state.providers
  );

  const providers = [openAi, anthropic, mistral];

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const handleSetModel = (provider, model) => {
    dispatch(setProvider({ provider }));
    dispatch(setModel({ provider, model }));
  };

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className=" cursor-pointer select-none rounded-xl hover:bg-[var(--hover)] flex items-center py-2 my-2 mx-2 px-4"
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
                <span>{provider.name}</span>

                {provider.models.map((model) => (
                  <div
                    key={model}
                    onClick={() => handleSetModel(provider.providerName, model)}
                    className="text-[var(--text)] p-2 flex items-center justify-between m-1 cursor-pointer select-none rounded-lg text-left hover:bg-[var(--hover)]"
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
    </div>
  );
}
