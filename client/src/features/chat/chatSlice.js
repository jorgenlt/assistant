import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatCompletion from "../../api/chatCompletion";
import generateConversationTitle from "../../api/generateConversationTitle";
import { BASE_API_URL } from "../../app/config";
import axios from "axios";

const initialState = {
  conversations: [],
  currentId: null,
  status: "idle",
  fetchConversationsStatus: "idle",
  error: null,
};

export const getChatResponseThunk = createAsyncThunk(
  "chat/getResponse",
  async (prompt, { getState, dispatch }) => {
    const {
      chat: { currentId },
      auth: { token, user },
      providers,
    } = getState();

    if (!currentId) {
      throw new Error("No active conversation selected (currentId is falsy).");
    }

    dispatch(updateMessages({ content: prompt, role: "user" }));

    const { provider, model } = providers.current;

    const response = await chatCompletion(
      currentId,
      user._id,
      prompt,
      provider,
      model,
      token
    );

    return response;
  }
);

export const fetchConversationsThunk = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { getState, dispatch }) => {
    const {
      auth: { token, user },
    } = getState();

    try {
      const url = `${BASE_API_URL}/conversations`;

      const userId = user._id;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId },
      });

      if (response.status === 200) {
        return response.data.conversations;
      }
    } catch (error) {
      console.error(error.message);
      dispatch(setError(error.message));
    }
  }
);

export const generateConversationTitleThunk = createAsyncThunk(
  "chat/generateTitle",
  async (prompt, { getState }) => {
    const conversationId = getState().chat.currentId;
    const {
      auth: { token, user },
    } = getState();
    const userId = user._id;

    try {
      const title = await generateConversationTitle(
        conversationId,
        prompt,
        userId,
        token
      );

      if (!title) {
        return {
          conversationId,
          title: "Error: title could not be generated.",
        };
      }

      return { conversationId, title };
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const deleteConversationThunk = createAsyncThunk(
  "chat/deleteConversation",
  async (id, { getState }) => {
    const {
      auth: { token, user },
    } = getState();

    const userId = user._id;

    try {
      const url = `${BASE_API_URL}/conversations/${id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId },
      });

      if (response.status === 200) {
        return id;
      } else {
        throw new Error(response);
      }
    } catch (error) {
      throw new Error("Failed to delete conversation", error);
    }
  }
);

// Chat slice of the Redux store
export const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addConversation: (state, action) => {
      const id = action.payload._id;
      state.currentId = id;
      // state.conversations[id] = action.payload;
      state.conversations.push(action.payload);
    },
    updateMessages: (state, action) => {
      const { currentId } = state;
      const message = {
        ...action.payload,
        created: Date.now(),
      };

      if (currentId) {
        const conv = state.conversations.find(
          (c) => c._id === currentId || c.id === currentId
        );
        if (conv) {
          if (!Array.isArray(conv.messages)) conv.messages = [];
          conv.messages.push(message);
        }
      }
    },
    deleteConversations: (state) => {
      state.conversations = [];
      state.currentId = null;
    },
    updateCurrentId: (state, action) => {
      state.currentId = action.payload;
    },
    importConversations: (state, action) => {
      state.conversations = action.payload;
      state.currentId = null;
    },
    resetChatSlice: () => {
      return {
        ...initialState,
      };
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Case when fetching chat response is pending
      .addCase(getChatResponseThunk.pending, (state) => {
        state.status = "loading";
      })
      // Case where getting chat response is successful (fulfilled)
      .addCase(getChatResponseThunk.fulfilled, (state, action) => {
        state.error = null;
        state.status = "idle";

        const currentId = state.currentId;
        const { content, role } = action.payload;

        if (currentId && content && role) {
          const conv = state.conversations.find(
            (c) => (c._id ?? c.id) === currentId
          );
          if (conv) {
            conv.messages.push({ created: Date.now(), content, role });
          }
        }
      })
      // Case where getting chat response failed
      .addCase(getChatResponseThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
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
      // Generate title finished
      .addCase(generateConversationTitleThunk.fulfilled, (state, action) => {
        const { conversationId, title } = action.payload;

        const conversation = state.conversations.find(
          (c) => c._id === conversationId
        );

        if (conversation) {
          conversation.title = title;
        }
      })
      // Generate title failed
      .addCase(generateConversationTitleThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteConversationThunk.fulfilled, (state, action) => {
        const id = action.payload;

        // Filter the conversations array to exclude a specific conversation by id
        state.conversations = state.conversations.filter(
          (c) =>
            // Use the nullish coalescing operator to get either c._id or c.id
            // If c._id is not null or undefined, use it; otherwise, use c.id
            (c._id ?? c.id) !== id // Check if the identifier does not match the given id
          // If they don't match, keep the conversation in the new array
        );

        if (state.currentId === id) state.currentId = null;
      })
      .addCase(deleteConversationThunk.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  addConversation,
  updateMessages,
  deleteConversations,
  getTitle,
  updateCurrentId,
  importConversations,
  resetChatSlice,
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
