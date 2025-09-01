import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice";
import { useMemo } from "react";
import ListItem from "../../components/ListItem";

function ChatList() {
  const conversations = useSelector((state) => state.chat.conversations);

  const dispatch = useDispatch();

  // const handleDeleteConversation = (id) => {
  //   // impactAsync(ImpactFeedbackStyle.Heavy);

  //   // Alert.alert("Delete conversation?", 'Choose "Delete" to confirm.', [
  //   //   {
  //   //     text: "Cancel",
  //   //     style: "cancel",
  //   //   },
  //   //   {
  //   //     text: "Delete",
  //   //     onPress: () => dispatch(deleteConversation(id)),
  //   //   },
  //   // ]);

  //   console.log("Delete conversation clicked");
  // };

  const getLastMessageDate = (conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage?.created;
  };

  const conversationElements = useMemo(() => {
    const ids = conversations ? Object.keys(conversations) : [];

    if (!ids.length) return [];

    const sortedIds = [...ids].sort((a, b) => {
      const aDate = getLastMessageDate(conversations[a]);
      const bDate = getLastMessageDate(conversations[b]);
      return bDate - aDate; // Sort in decending order
    });

    return sortedIds.map((id) => {
      const title = conversations[id].title || null;

      return (
        <ListItem
          key={id}
          action={() => dispatch(updateCurrentId(id))} // Change current conversation
          title={title}
        />
      );
    });
  }, [conversations, dispatch]);

  return (
    <div className="cursor-default select-none mt-6">
      <span className="text-gray-400 px-3 py-2 mx-2">Chats</span>
      {conversationElements}
    </div>
  );
}

export default ChatList;
