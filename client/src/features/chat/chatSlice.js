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
  createConversationStatus: "idle",
  deletingConversationId: null,
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

    const conversationId = currentId;

    dispatch(
      updateMessages({
        conversationId,
        message: { content: prompt, role: "user", created: Date.now() },
      })
    );

    const { provider, model } = providers.current;

    const response = await chatCompletion(
      conversationId,
      user._id,
      prompt,
      provider,
      model,
      token
    );

    return { conversationId, response };
  }
);

export const createConversationThunk = createAsyncThunk(
  "chat/createConversation",
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { token, user },
    } = getState();

    try {
      const url = `${BASE_API_URL}/conversations`;

      const userId = user._id;

      const response = await axios.post(
        url,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        return response.data;
      }

      return rejectWithValue("Invalid create conversation response");
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Login failed";
      return rejectWithValue(msg);
    }
  }
);

export const fetchConversationsThunk = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { getState, dispatch }) => {
    const {
      chat: { currentId },
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

      const conversations = response.data.conversations;

      // Check if conversation with id currentId exists
      const currentConversationExists = conversations.some(
        (conversation) => conversation._id === currentId
      );
      if (!currentConversationExists) {
        dispatch(updateCurrentId(null));
      }

      if (response.status === 200) {
        return conversations;
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
        state.error = action.error.message;
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
      .addCase(generateConversationTitleThunk.fulfilled, (state, action) => {
        const { conversationId, title } = action.payload;

        const conversation = state.conversations.find(
          (c) => c._id === conversationId
        );

        if (conversation) {
          conversation.title = title;
        }
      })
      .addCase(generateConversationTitleThunk.rejected, (state, action) => {
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
