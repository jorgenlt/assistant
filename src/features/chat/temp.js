import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchOpenAiChatCompletion from "../../api/openAiApi";
import fetchAnthropicChatCompletion from "../../api/anthropicApi";
import fetchMistralChatCompletion from "../../api/mistralApi";
import generateConversationTitle from "../../api/generateConversationTitle";
import uuid from "react-native-uuid";
const initialState = {
  conversations: {},
  currentId: null,
  status: "idle",
  error: null,
};

// Thunk to generate conversation title (ensure we await the promise)
export const generateConversationTitleThunk = createAsyncThunk(
  "chat/generateTitle",
  async ({ currentId, prompt, providers }) => {
    const title = await generateConversationTitle(prompt, providers);
    return { currentId, title };
  }
);

// Get chat completion from chosen provider using async thunk
export const getChatResponseThunk = createAsyncThunk(
  "chat/getResponse",
  async (prompt, { getState, dispatch }) => {
    const {
      chat: { currentId, conversations },
      providers,
    } = getState();
    console.log("providers", providers);
    if (!currentId) {
      throw new Error("No active conversation selected (currentId is falsy).");
    }
    const conversation = conversations[currentId];
    if (!conversation) {
      throw new Error(`Conversation not found for currentId: ${currentId}`);
    }

    // Remove key/value "created" from obj. API doesn't support additional input
    const context = conversation.messages.map(({ _, ...rest }) => rest);
    const provider = providers.current.provider;
    const fetchers = {
      openAi: fetchOpenAiChatCompletion,
      anthropic: fetchAnthropicChatCompletion,
      mistral: fetchMistralChatCompletion,
    };
    const fetcher = fetchers[provider];
    if (!fetcher) {
      throw new Error("Unsupported chat completion provider: " + provider);
    }
    const response = await fetcher(context, prompt, providers);

    // Fire-and-forget: generate title in the background for the first message
    if (context.length === 0 && !conversation?.title) {
      dispatch(
        generateConversationTitleThunk({ currentId, prompt, providers })
      );
    }

    // Return the response immediately (title may come later via background thunk)
    return response;
  }
);

// Chat slice of the Redux store
export const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addConversation: (state) => {
      const id = uuid.v4();
      state.currentId = id;
      state.conversations[id] = { created: Date.now(), messages: [] };
    },
    updateMessages: (state, action) => {
      const { currentId } = state;
      const message = { ...action.payload, created: Date.now() };
      if (currentId) {
        state.conversations[currentId]?.messages.push(message);
      }
    },
    deleteConversation: (state, action) => {
      const id = action.payload;
      delete state.conversations[id];
      state.currentId = null;
    },
    deleteConversations: (state) => {
      state.conversations = {};
      state.currentId = null;
    },
    updateCurrentId: (state, action) => {
      state.currentId = action.payload;
    },
    importConversations: (state, action) => {
      state.conversations = action.payload;
      state.currentId = null;
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
        const { currentId } = state;
        const { content, role } = action.payload;
        if (currentId && content && role) {
          const message = { created: Date.now(), content, role };

          // Push the fetched message into the messages of current conversation
          state.conversations[currentId]?.messages.push(message);
        }
      })

      // Case where getting chat response failed
      .addCase(getChatResponseThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Title generation finished (background)
      .addCase(generateConversationTitleThunk.fulfilled, (state, action) => {
        const { currentId, title } = action.payload;
        if (state.conversations[currentId]) {
          state.conversations[currentId].title = title;
        }
      })

      // Optional: handle title generation failure gracefully
      .addCase(generateConversationTitleThunk.rejected, (state, action) => {
        // You can log or ignore; don't block chat flow
      });
  },
});
// Action creators are generated for each case reducer function
export const {
  addConversation,
  updateMessages,
  deleteConversation,
  deleteConversations,
  updateCurrentId,
  importConversations,
} = chat.actions;
export default chat.reducer;
