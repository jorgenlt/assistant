import { FaCheck, FaGear } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setProvider, setModel } from "../../providers/providersSlice";

const DropdownProvidersMenu = ({ setActiveProvider, setIsOpen, apiKeys }) => {
  const { current, openAi, anthropic, mistral, gemini, xai } = useSelector(
    (state) => state.providers,
  );

  const hasApiKey = apiKeys?.length > 0;

  const providers = [openAi, anthropic, mistral, gemini, xai];

  const dispatch = useDispatch();

  const handleSetModel = (provider, model) => {
    dispatch(setProvider({ provider }));
    dispatch(setModel({ provider, model }));
    setIsOpen(false);
  };

  return (
    <div className="ml-2 absolute z-10 min-w-max *:left-0 origin-top-left divide-y rounded-xl shadow-lg bg-[var(--bg1)] overflow-y-auto max-h-[85vh]">
      <div className="py-1">
        {/* Providers */}
        {providers.map((provider) => (
          <div
            key={provider.name}
            className={`${
              apiKeys?.includes(provider.provider) ? "" : "text-neutral-400"
            } p-2 flex flex-col m-1 cursor-default select-none text-left`}
          >
            <div className="flex items-center justify-between">
              <span>{provider.name}</span>
              <div
                onClick={() => setActiveProvider(provider)}
                className="cursor-pointer select-none p-2 rounded-full text-[var(--text)] hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
              >
                <FaGear />
              </div>
            </div>

            {/* Models */}
            {provider.models.map((model) => {
              const isAvailable = apiKeys?.includes(provider.provider);

              return (
                <button
                  key={model}
                  onClick={() =>
                    isAvailable
                      ? handleSetModel(provider.provider, model)
                      : null
                  }
                  disabled={!isAvailable}
                  aria-disabled={!isAvailable}
                  className={`p-2 flex items-center justify-between m-1 select-none rounded-xl text-left
        ${
          isAvailable
            ? "text-[var(--text)] cursor-pointer hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
            : "text-neutral-400 cursor-not-allowed pointer-events-none"
        }`}
                >
                  {model}{" "}
                  {hasApiKey && current.model === model && (
                    <div className="pl-2">
                      <FaCheck />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownProvidersMenu;
