import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../../chat/chatSlice";

const SearchChats = ({ onClose }) => {
  const conversations = useSelector((state) => state.chat.conversations);

  const [query, setQuery] = useState("");

  const dispatch = useDispatch();

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.messages.some((message) =>
        message.content.toLowerCase().includes(query.toLowerCase())
      ) || conversation.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleUpdateCurrentId = (id) => {
    dispatch(updateCurrentId(id));
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const id = filteredConversations[0]?._id;
      if (id) handleUpdateCurrentId(id);
    }
  };

  const titleElements = filteredConversations.map((conversation, i) => {
    return (
      <div
        className="cursor-pointer select-none p-2 rounded-xl hover:bg-[var(--hover)]"
        onClick={() => handleUpdateCurrentId(conversation._id)}
        key={i}
      >
        <span>{conversation.title}</span>
      </div>
    );
  });

  return (
    <div className="w-xl">
      <div className="p-4 border-b-1 border-b-gray-700">
        <input
          className="w-full pr-6"
          placeholder="Search chats..."
          name="query"
          autoComplete="off"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="py-2">
        <div className="px-2 h-[40vh] overflow-y-scroll overflow-x-hidden ">
          {titleElements}
        </div>
      </div>
    </div>
  );
};

export default SearchChats;
