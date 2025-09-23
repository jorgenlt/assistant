import DropdownProviders from "./components/DropdownProviders";
import { useWindowSize } from "react-use";
import { useState } from "react";
import { FaBars, FaTrashCan } from "react-icons/fa6";
import { setIsMenuOpen } from "../menu/menuSlice";
import { deleteConversationThunk } from "../chat/chatSlice";
import { useDispatch } from "react-redux";
import DropdownChat from "../menu/components/DropdownChat";

const ChatHeader = ({ currentId }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();

  const isMobile = useWindowSize().width < 767;

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    dispatch(deleteConversationThunk(currentId));
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="relative border-b border-[#83838326] flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <div
            className="cursor-pointer ml-2"
            onClick={() => dispatch(setIsMenuOpen(true))}
          >
            <FaBars size={30} />
          </div>
        )}
        <DropdownProviders isMobile={isMobile} />
      </div>
      {isMobile && (
        <div className="mr-2" onClick={handleDeleteClick}>
          <FaTrashCan size={26} />
        </div>
      )}
      {showConfirm && (
        <DropdownChat
          cancelDelete={cancelDelete}
          confirmDelete={confirmDelete}
        />
      )}
    </div>
  );
};

export default ChatHeader;
