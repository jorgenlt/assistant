import { createSlice } from "@reduxjs/toolkit";
import {
  createConversationThunk,
  getChatResponseThunk,
  fetchConversationsThunk,
  generateConversationTitleThunk,
  deleteConversationThunk,
} from "./chatThunks";

const initialState = {
  conversations: [],
  currentId: null,
  status: "idle",
  fetchConversationsStatus: "idle",
  createConversationStatus: "idle",
  generateConversationTitleId: null,
  deletingConversationId: null,
  error: null,
};

// Chat slice of the Redux store
export const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addConversation: (state, action) => {
      const id = action.payload._id;
      state.currentId = id;
      state.conversations.push(action.payload);
    },
    updateMessages: (state, action) => {
      const { conversationId, message } = action.payload;

      if (conversationId) {
        const conv = state.conversations.find(
          (c) => c._id === conversationId || c.id === conversationId
        );
        if (conv) {
          if (!Array.isArray(conv.messages)) conv.messages = [];
          conv.messages.push(message);
        }
      }
    },
    updateCurrentId: (state, action) => {
      state.currentId = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create conversation
      .addCase(createConversationThunk.pending, (state) => {
        state.createConversationStatus = "loading";
      })
      .addCase(createConversationThunk.fulfilled, (state, action) => {
        state.createConversationStatus = "idle";
        const id = action.payload._id;
        state.currentId = id;
        state.conversations.push(action.payload);
      })
      .addCase(createConversationThunk.rejected, (state, action) => {
        state.createConversationStatus = "failed";
        state.error =
          action.payload ??
          action.error?.message ??
          "Create conversation failed";
      })

      // Get chat response
      .addCase(getChatResponseThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getChatResponseThunk.fulfilled, (state, action) => {
        state.error = null;
        state.status = "idle";

        const { conversationId, response } = action.payload;
        const { content, role } = response;

        if (conversationId && content && role) {
          const conv = state.conversations.find(
            (c) => (c._id ?? c.id) === conversationId
          );
          if (conv) {
            conv.messages.push({ created: Date.now(), content, role });
          }
        }
      })
      .addCase(getChatResponseThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action?.error?.response?.data?.error || action.error.message;
      })

      // Fetch conversations
      .addCase(fetchConversationsThunk.pending, (state) => {
        state.fetchConversationsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchConversationsThunk.fulfilled, (state, action) => {
        state.fetchConversationsStatus = "idle";

        const conversations = action.payload;

        state.conversations = conversations;
      })
      .addCase(fetchConversationsThunk.rejected, (state, action) => {
        state.fetchConversationsStatus = "failed";
        state.error =
          action.payload ??
          action.error?.message ??
          "Failed to fetch conversations";
      })

      // Generate title
      .addCase(generateConversationTitleThunk.pending, (state) => {
        state.generateConversationTitleId = state.currentId;
      })
      .addCase(generateConversationTitleThunk.fulfilled, (state, action) => {
        state.generateConversationTitleId = null;
        const { conversationId, title } = action.payload;

        const conversation = state.conversations.find(
          (c) => c._id === conversationId
        );

        if (conversation) {
          conversation.title = title;
        }
      })
      .addCase(generateConversationTitleThunk.rejected, (state, action) => {
        state.generateConversationTitleId = null;
        state.error = action.error.message;
      })

      // Delete conversation
      .addCase(deleteConversationThunk.pending, (state, action) => {
        state.deletingConversationId = action.meta.arg; // track which id is deleting
        state.error = null;
      })
      .addCase(deleteConversationThunk.fulfilled, (state, action) => {
        state.deletingConversationId = null;
        state.error = null;
        const id = action.payload;

        state.conversations = state.conversations.filter(
          (c) => (c._id ?? c.id) !== id
        );

        if (state.currentId === id) state.currentId = null;
      })
      .addCase(deleteConversationThunk.rejected, (state, action) => {
        state.deletingConversationId = null;
        state.error = action.error?.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  addConversation,
  updateMessages,
  getTitle,
  updateCurrentId,
  setError,
} = chat.actions;

export default chat.reducer;

/*
Usage tips

On app load, dispatch fetchConversations() to populate the list.
After creating a conversation (via createConversation thunk), you can rely on the fulfilled case to merge it into state.conversations automatically or call fetchConversations() again if you prefer a fresh fetch.
Since your conversations have embedded messages, the fetched objects will include messages arrays. Your UI can render the list from state.conversations and open a conversation to view its messages.
Example usage in a component

import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from './path/to/chatSlice';
import { selectAllConversations } from './path/to/selectors'; // if you expose a selector

// On mount
useEffect(() => {
  dispatch(fetchConversations());
}, [dispatch]);

// Access in component
const conversations = useSelector((state) => Object.values(state.chat.conversations));
*/
