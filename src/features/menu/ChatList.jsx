import { useDispatch, useSelector } from "react-redux";
import { updateCurrentId } from "../chat/chatSlice";
import { useMemo } from "react";
import { truncateString } from "../../common/utils/truncateString";

function ChatList() {
  const conversations = useSelector((state) => state.chat.conversations);

  const ids = conversations ? Object.keys(conversations) : [];

  const dispatch = useDispatch;

  const handleChangeConversation = (id) => {
    dispatch(updateCurrentId(id));
  };

  const handleDeleteConversation = (id) => {
    // impactAsync(ImpactFeedbackStyle.Heavy);

    // Alert.alert("Delete conversation?", 'Choose "Delete" to confirm.', [
    //   {
    //     text: "Cancel",
    //     style: "cancel",
    //   },
    //   {
    //     text: "Delete",
    //     onPress: () => dispatch(deleteConversation(id)),
    //   },
    // ]);

    console.log("Delete conversation clicked");
  };

  const getLastMessageDate = (conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage?.created;
  };

  const ConversationList = () => {
    const conversationElements = useMemo(() => {
      if (!ids) return [];

      const sortedIds = ids.sort((a, b) => {
        const aDate = getLastMessageDate(conversations[a]);
        const bDate = getLastMessageDate(conversations[b]);
        return bDate - aDate; // Sort in decending order
      });

      return sortedIds.map((id) => {
        const conversation = conversations[id].messages;
        const lastTwoItems = conversation.slice(-2);
        const userObject = lastTwoItems.find((item) => item.role === "user");
        const assistantObject = lastTwoItems.find(
          (item) => item.role === "assistant"
        );
        const userMessage = userObject ? userObject.content : "";
        const assistantMessage = assistantObject ? assistantObject.content : "";

        return (
          <div key={id}>
            <span>You:</span><span>{truncateString(userMessage, 20)}</span>
            <br />
            <span>Assistant:</span><span>{truncateString(assistantMessage, 20)}</span>
          </div>
        )
      })

    }, [ids, conversations, handleDeleteConversation]);

    return conversationElements;
  };

  return (
    <div className="cursor-default select-none mx-2 px-3 py-2 text-gray-400">
      <p>Chats</p>
      <ConversationList />
    </div>
  );
}

export default ChatList;
