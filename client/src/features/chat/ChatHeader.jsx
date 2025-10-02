import DropdownProviders from "./components/DropdownProviders";
import { useState } from "react";
import { FaBars, FaEllipsisVertical } from "react-icons/fa6";
import { setIsSidebarOpen } from "../sidebar/sidebarSlice";
import { deleteConversationThunk } from "./chatThunks";
import { useDispatch, useSelector } from "react-redux";
import DropdownChat from "../sidebar/components/DropdownChat";

const ChatHeader = ({ currentId }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const isCurrentIdNull = useSelector((state) => state.chat.currentId) === null;

  const dispatch = useDispatch();

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
        <div
          className="md:hidden cursor-pointer ml-2"
          onClick={() => dispatch(setIsSidebarOpen(true))}
        >
          <FaBars size={30} />
        </div>

        <DropdownProviders />
      </div>
      {!isCurrentIdNull && (
        <div
          className="md:hidden cursor-pointer mr-2"
          onClick={handleDeleteClick}
        >
          <FaEllipsisVertical size={26} />
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
