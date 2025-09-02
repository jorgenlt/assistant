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

// Get chat completion from chosen provider using async thunk
export const getChatResponseThunk = createAsyncThunk(
  "chat/getResponse",
  async (prompt, { getState }) => {
    const {
      chat: { currentId, conversations },
      providers,
    } = getState();

    // Exit early if currentId is falsy
    if (!currentId) {
      console.error("currentId is null or undefined");
      return;
    }

    // Remove key/value "created" from obj. API doesn't support additional input
    const context = conversations[currentId].messages.map((message) => {
      const { _, ...rest } = message;
      return rest;
    });

    const provider = providers.current.provider;

    try {
      let response;

      switch (provider) {
        case "openAi":
          response = await fetchOpenAiChatCompletion(
            context,
            prompt,
            providers
          );
          break;
        case "anthropic":
          response = await fetchAnthropicChatCompletion(
            context,
            prompt,
            providers
          );
          break;
        case "mistral":
          response = await fetchMistralChatCompletion(
            context,
            prompt,
            providers
          );
          break;
        default:
          throw new Error("Unsupported chat completion provider: " + provider);
      }

      // Generate title only for the first message
      if (context.length === 0) {
        const title = await generateConversationTitle(prompt, providers);
        return { ...response, title };
      }

      return response;
    } catch (error) {
      return Promise.reject(error.message);
    }
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
      state.conversations[id] = {
        created: Date.now(),
        messages: [],
      };
    },
    updateMessages: (state, action) => {
      const { currentId } = state;
      const message = {
        ...action.payload,
        created: Date.now(),
      };

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
        const { content, role, title } = action.payload;

        if (currentId && content && role) {
          const message = {
            created: Date.now(),
            content,
            role,
          };

          // Push the fetched message into the messages of current conversation
          state.conversations[currentId]?.messages.push(message);

          // If we got a title (first message case), store it
          if (title && !state.conversations[currentId].title) {
            state.conversations[currentId].title = title;
          }
        }
      })
      // Case where getting chat response failed
      .addCase(getChatResponseThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
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
