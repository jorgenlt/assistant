import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_API_URL } from "../../app/config";
import axios from "axios";
import { updateUser } from "../auth/authSlice";

const initialState = {
  status: "idle",
  error: null,
  current: { name: "OpenAI", provider: "openAi", model: "gpt-5-nano" },
  default: { name: "OpenAI", provider: "openAi", model: "gpt-5-nano" },
  openAi: {
    name: "OpenAI",
    provider: "openAi",
    model: "gpt-5-nano",
    models: ["gpt-5-nano", "gpt-5-mini", "gpt-5"],
    pricingLink: "https://openai.com/api/pricing/",
    getApiLink: "https://auth.openai.com/create-account",
    usageLink: "https://platform.openai.com/settings/organization/usage",
  },
  anthropic: {
    name: "Anthropic",
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    models: [
      "claude-3-5-haiku-20241022",
      "claude-sonnet-4-20250514",
      "claude-opus-4-1-20250805",
    ],
    pricingLink: "https://claude.com/pricing",
    getApiLink: "https://docs.claude.com/en/docs/get-started",
    usageLink: "https://console.anthropic.com/usage",
  },
  mistral: {
    name: "Mistral",
    provider: "mistral",
    model: "mistral-small-latest",
    models: ["mistral-small-latest", "mistral-large-latest"],
    pricingLink: "https://mistral.ai/pricing#api-pricing",
    getApiLink: "https://console.mistral.ai",
    usageLink: "https://console.mistral.ai/usage",
  },
  gemini: {
    name: "Gemini",
    provider: "gemini",
    model: "gemini-2.5-flash-lite",
    models: [
      "gemini-3-pro-preview",
      "gemini-3-flash-preview",
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ],
    pricingLink: "https://ai.google.dev/gemini-api/docs/pricing",
    getApiLink: "https://ai.google.dev/gemini-api/docs/api-key",
    usageLink: "https://aistudio.google.com/usage",
  },
  xai: {
    name: "xAI",
    provider: "xai",
    model: "grok-4-1-fast-non-reasoning",
    models: ["grok-4-1-fast-non-reasoning", "grok-4-1-fast-reasoning"],
    pricingLink: "https://docs.x.ai/developers/models#model-pricing",
    getApiLink: "https://console.x.ai/home",
    usageLink: "https://console.x.ai/home",
  },
};

export const addApiKeyThunk = createAsyncThunk(
  "providers/addApiKey",
  async (
    { provider, key, userId, token },
    { getState, dispatch, rejectWithValue },
  ) => {
    try {
      const url = `${BASE_API_URL}/users/${userId}/apikeys`;
      const response = await axios.patch(
        url,
        { provider, key },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        // Update user in auth
        const updatedUser = response.data.userObj;
        dispatch(updateUser(updatedUser));

        // Set provider/model to match added API key
        const model = getState().providers[provider].model;
        dispatch(setProvider({ provider }));
        dispatch(setModel({ provider, model }));

        return response.data;
      } else {
        console.error(`Unexpected response status: ${response.status}`);
        return null;
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Adding API key failed";
      return rejectWithValue(msg);
    }
  },
);

export const providers = createSlice({
  name: "providers",
  initialState,
  reducers: {
    deleteKey: (state, action) => {
      const { provider } = action.payload;
      state[provider].key = null;
    },
    setProvider: (state, action) => {
      const { provider } = action.payload;
      state.current.name = state[provider].name;
      state.current.provider = provider;
      state.current.model = state[provider].model;
    },
    resetProviderSlice: (state) => {
      const openAiKey = state.openAi.key;
      const anthropicKey = state.anthropic.key;
      const mistralKey = state.mistral.key;

      return {
        ...initialState,
        openAi: { ...initialState.openAi, key: openAiKey },
        anthropic: { ...initialState.anthropic, key: anthropicKey },
        mistral: { ...initialState.mistral, key: mistralKey },
      };
    },
    setModel: (state, action) => {
      const { provider, model } = action.payload;
      if (!state[provider]) return;

      state[provider].model = model;

      if (state.current.provider === provider) {
        state.current.model = model;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addApiKeyThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addApiKeyThunk.fulfilled, (state) => {
        state.status = "idle";
        state.error = null;
      })
      .addCase(addApiKeyThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error?.message ?? "Signup failed";
      });
  },
});

export const { deleteKey, setProvider, resetProviderSlice, setModel } =
  providers.actions;

export default providers.reducer;
