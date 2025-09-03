import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current: { name: "OpenAI", provider: "openAi", model: "gpt-5-nano" },
  default: { name: "OpenAI", provider: "openAi", model: "gpt-5-nano" },
  openAi: {
    name: "OpenAI",
    providerName: "openAi",
    key: null,
    model: "gpt-5-nano",
    models: ["gpt-5", "gpt-5-mini", "gpt-5-nano"],
  },
  anthropic: {
    name: "Anthropic",
    providerName: "anthropic",
    key: null,
    model: "claude-3-7-sonnet-20250219",
    models: [
      "claude-3-5-haiku-20241022",
      "claude-sonnet-4-20250514",
      "claude-opus-4-1-20250805",
    ],
  },
  mistral: {
    name: "Mistral",
    providerName: "mistral",
    key: null,
    model: "mistral-small-latest",
    models: ["mistral-small-latest", "mistral-large-latest"],
  },
};

export const providers = createSlice({
  name: "providers",
  initialState,
  reducers: {
    deleteKey: (state, action) => {
      const { provider } = action.payload;
      state[provider].key = null;
    },
    addKey: (state, action) => {
      const { provider, apiKey } = action.payload;
      state[provider].key = apiKey;
    },
    setProvider: (state, action) => {
      const { provider } = action.payload;
      state.current.name = state[provider].name;
      state.current.provider = provider;
      state.current.model = state[provider].model;
    },
    resetProviders: (state) => {
      // Preserve the current keys
      const openAiKey = state.openAi.key;
      const anthropicKey = state.anthropic.key;
      const mistralKey = state.mistral.key;

      // Reset providers to initial state
      state = {
        ...initialState,
        openAi: {
          ...initialState.openAi,
          key: openAiKey,
        },
        anthropic: {
          ...initialState.anthropic,
          key: anthropicKey,
        },
        mistral: {
          ...initialState.mistral,
          key: mistralKey,
        },
      };
    },
    setModel: (state, action) => {
      const { provider  , model } = action.payload;

      const currentProvider = state.current.provider;

      if (provider === currentProvider) {
        state.current.model = model;
        state[provider].model = model;
      } else {
        state[provider].model = model;
      }
    },
  },
});

export const { deleteKey, addKey, setProvider, resetProviders, setModel } =
  providers.actions;

export default providers.reducer;
