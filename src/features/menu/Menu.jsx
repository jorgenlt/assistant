import { FaPenToSquare, FaGear } from "react-icons/fa6";

function Menu() {
  return (
    <>
      <div className="menu-container">
        <div>
          <div className="new-chat">
            <FaPenToSquare /> New Chat
          </div>
          <div className="chats">
            <p>No chats</p>
          </div>
        </div>
        <div>
          <div className="settings">
            <FaGear /> Settings
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
