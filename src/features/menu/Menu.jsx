import { FaPenToSquare, FaGear, FaMoon, FaArrowRight } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ChatList from "./ChatList.jsx";
import { addConversation, addKey } from "../chat/chatSlice.js";
import { toggleTheme } from "./menuSlice.js";
import { useDispatch, useSelector } from "react-redux";
import SidebarItem from "../../components/SidebarItem.jsx";

function Menu() {
  // const [apiKey, setApiKey] = useState("");

  const { provider: currentProvider } = useSelector(
    (state) => state.chat.providers.current
  );

  const dispatch = useDispatch();

  const handleNewChat = () => {
    dispatch(addConversation());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const setApi = async () => {
    const apiKey = await navigator.clipboard.readText();
    dispatch(addKey({ provider: currentProvider, apiKey: apiKey.trim() }));
  };

  return (
    <div className="flex flex-col justify-between h-screen w-1/5  bg-neutral-100 dark:bg-gray-900 text-gray-900 dark:text-neutral-50">
      <div>
        <MenuHeader />
        <div className="mt-2">
          <SidebarItem
            action={handleNewChat}
            title="New Chat"
            Icon={FaPenToSquare}
          />
          <ChatList />
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
