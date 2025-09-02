import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa6";

function ChatHeader() {
  const { current, openAi, anthropic, mistral } = useSelector(
    (state) => state.providers
  );

  const providers = [openAi.name, anthropic.name, mistral.name];
  console.log("🚀 ~ providers:", providers);

  return (
    <div className="border-b border-[#83838326]">
      <div className="cursor-pointer select-none rounded-xl hover:bg-[var(--hover)] w-fit flex items-center py-2 my-2 mx-2 px-4">
        <span className="mr-2">
          {current.name} ({current.model})
        </span>
        <FaChevronDown size={13} />
      </div>
    </div>
  );
}

export default ChatHeader;
