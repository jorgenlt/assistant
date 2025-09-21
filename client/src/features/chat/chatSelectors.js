import { createSelector } from "@reduxjs/toolkit";

export const selectConversations = (state) => state.chat.conversations;
export const selectCurrentId = (state) => state.chat.currentId;
export const selectError = (state) => state.chat.error;
export const selectStatus = (state) => state.chat.status;

export const selectStatusError = createSelector(
  [selectStatus, selectError],
  (status, error) => {
    return {
      status,
      error,
    };
  }
);

export const selectConversationById = createSelector(
  [selectConversations, (state, conversationId) => conversationId],
  (conversations, conversationId) =>
    conversations.find((c) => c._id === conversationId)
);

export const selectCurrentConversation = createSelector(
  [selectConversations, selectCurrentId],
  (conversations, currentId) => {
    if (!Array.isArray(conversations) || !currentId) {
      return null;
    }
    return conversations.find(({ _id }) => _id === currentId) || null;
  }
);

// Selector for current conversation messages
export const selectCurrentConversationMessages = createSelector(
  [selectCurrentConversation],
  (conversation) => conversation?.messages || []
);
