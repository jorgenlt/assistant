import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current: { name: "OpenAI", provider: "openAi", model: "gpt-5-nano" },
  default: { name: "OpenAI", provider: "openAi", model: "gpt-5-nano" },
  openAi: {
    name: "OpenAI",
    provider: "openAi",
    model: "gpt-5-nano",
    models: ["gpt-5", "gpt-5-mini", "gpt-5-nano"],
    pricingLink: "https://openai.com/api/pricing/",
    getApiLink: "https://auth.openai.com/create-account",
    usageLink: "https://platform.openai.com/settings/organization/usage",
  },
  anthropic: {
    name: "Anthropic",
    provider: "anthropic",
    model: "claude-3-7-sonnet-20250219",
    models: [
      "claude-3-5-haiku-20241022",
      "claude-sonnet-4-20250514",
      "claude-opus-4-1-20250805",
    ],
    pricingLink: "https://www.anthropic.com/pricing#api",
    getApiLink: "https://docs.anthropic.com/en/docs/get-started",
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
};

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

export const { deleteKey, setProvider, resetProviderSlice, setModel } =
  providers.actions;

export default providers.reducer;
