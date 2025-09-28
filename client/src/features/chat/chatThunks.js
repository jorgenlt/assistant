import { createAsyncThunk } from "@reduxjs/toolkit";
import chatCompletion from "../../api/chatCompletion";
import generateConversationTitle from "../../api/generateConversationTitle";
import { updateMessages, updateCurrentId, setError } from "./chatSlice";
import { BASE_API_URL } from "../../app/config";
import axios from "axios";

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
