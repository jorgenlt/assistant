import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  isThemeDark: false,
  themes: [
    "light",
    "dark",
    // Dark themes
    "github-dark",
    "vscode-dark",
    "slack-dark",
    "discord-dark",
    "material-dark",
    "jetbrains-dark",
    "one-dark",
    "dracula-dark",
    "monokai-dark",
    "oled-dark",
    // Light themes
    "slack-light",
    "discord-light",
    "material-light",
    "sunset",
  ],
};

export const menu = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      console.log(action.payload);
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      const currentIndex = state.themes.indexOf(state.theme);
      const nextIndex =
        currentIndex >= 0 ? (currentIndex + 1) % state.themes.length : 0;
      state.theme = state.themes[nextIndex];
      state.isThemeDark = /dark/.test(state.theme);
    },
    toggleLargeText: (state) => {
      state.largeText = !state.largeText;
    },
  },
  extraReducers: () => {},
});

export const { setTheme, toggleTheme, toggleLargeText } = menu.actions;

export default menu.reducer;
