import { FaPenToSquare, FaGear } from "react-icons/fa6";
import MenuHeader from "./MenuHeader.jsx";
import ChatList from "./ChatList.jsx";

function Menu() {
  return (
    <div className="menu-container">
      <div>
        <MenuHeader />
        <div className="new-chat">
          <FaPenToSquare /> New Chat
        </div>
        <ChatList />
      </div>
      <div>
        <div className="settings">
          <FaGear /> Settings
        </div>
      </div>
    </div>
  );
}

export default Menu;
