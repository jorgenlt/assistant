import { FaPenToSquare, FaGear, FaMoon, FaArrowRight } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ChatList from "./ChatList.jsx";
import { updateCurrentId } from "../chat/chatSlice.js";
import { addKey } from "../providers/providersSlice.js";
import { toggleTheme } from "./menuSlice.js";
import { useDispatch, useSelector } from "react-redux";
import SidebarItem from "../../components/SidebarItem.jsx";

function Menu() {
  const { provider: currentProvider } = useSelector(
    (state) => state.providers.current
  );

  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleResetId = () => {
    dispatch(updateCurrentId(null));
  };

  const setApi = async () => {
    const apiKey = await navigator.clipboard.readText();
    dispatch(addKey({ provider: currentProvider, apiKey: apiKey.trim() }));
  };

  return (
    <div className="flex flex-col justify-between w-1/5  bg-neutral-100 dark:bg-gray-900 text-gray-900 dark:text-neutral-50">
      <div>
        <MenuHeader action={handleResetId} />
        <div className="chat-list mt-2 flex flex-col h-[calc(100vh-10rem)]">
          <SidebarItem
            action={handleResetId}
            title="New Chat"
            Icon={FaPenToSquare}
          />
          <div className="flex-1 overflow-y-auto mt-2 border-t border-b border-[#83838326]">
            <ChatList />
          </div>
        </div>
      </div>

      <div className="mb-2">
        <SidebarItem action={setApi} title="Set API Key" Icon={FaArrowRight} />
        <SidebarItem
          action={handleToggleTheme}
          title="Toggle Dark Mode"
          Icon={FaMoon}
        />
        <SidebarItem
          action={() => console.log("Settings clicked")}
          title="Settings"
          Icon={FaGear}
        />
      </div>
    </div>
  );
}

export default Menu;
