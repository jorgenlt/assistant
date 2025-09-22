import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId, deleteConversationThunk } from "../chat/chatSlice";
import { setIsMenuOpen } from "./menuSlice";
import { useMemo } from "react";
import ListItem from "./components/ListItem";

const ConversationsList = () => {
  const { conversations, currentId } = useSelector((state) => state.chat);
  const isMobile = useSelector((state) => state.menu.isMobile);

  const dispatch = useDispatch();

  const conversationElements = useMemo(() => {
    if (conversations.length === 0) return [];

    const sorted = [...conversations].sort((a, b) => {
      // get last message date (or updatedAt if no messages)
      const aLast = a.messages.length
        ? new Date(a.messages[a.messages.length - 1].created)
        : new Date(a.updatedAt);

      const bLast = b.messages.length
        ? new Date(b.messages[b.messages.length - 1].created)
        : new Date(b.updatedAt);

      // sort descending (latest first)
      return bLast - aLast;
    });

    const handleDeleteConversation = (id) => {
      dispatch(deleteConversationThunk(id));
    };

    const handleUpdateCurrentId = (id) => {
      dispatch(updateCurrentId(id));
      if (isMobile) dispatch(setIsMenuOpen(false));
    };

    return sorted.map((conversation) => {
      const id = conversation._id;
      const isCurrent = id === currentId;
      const title = conversation.title || null;

      return (
        <ListItem
          key={id}
          action={() => handleUpdateCurrentId(id)}
          title={title}
          id={id}
          isCurrent={isCurrent}
          onDelete={() => handleDeleteConversation(id)}
        />
      );
    });
  }, [conversations, currentId, dispatch]);

  return (
    <div className="cursor-default select-none mt-2">
      <span className="text-gray-400 px-3 py-2 mx-2">Chats</span>
      {conversationElements}
    </div>
  );
};

export default ConversationsList;
