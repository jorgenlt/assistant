import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId, deleteConversationThunk } from "../chat/chatSlice";
import { useMemo } from "react";
import ListItem from "./components/ListItem";

function ChatList() {
  const conversations = useSelector((state) => state.chat.conversations);

  const dispatch = useDispatch();

  const getId = (conversation) => conversation?._id ?? conversation?.id;

  const conversationElements = useMemo(() => {
    const convs = Array.isArray(conversations) ? conversations : [];

    if (convs.length === 0) return [];

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

    return sorted.map((conv) => {
      const id = getId(conv);
      const title = conv.title ?? null;

      return (
        <ListItem
          key={id}
          action={() => dispatch(updateCurrentId(id))} // Change current conversation
          title={title}
          id={id}
          onDelete={() => handleDeleteConversation(id)}
        />
      );
    });
  }, [conversations, dispatch]);

  return (
    <div className="cursor-default select-none mt-2">
      <span className="text-gray-400 px-3 py-2 mx-2">Chats</span>
      {conversationElements}
    </div>
  );
}

export default ChatList;
