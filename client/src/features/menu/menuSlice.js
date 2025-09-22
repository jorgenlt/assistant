import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark",
  isThemeDark: true,
  isSearchOpen: false,
  isMenuOpen: false,
  isMobile: true,
  themes: [
    "dark",
    "light",
    // Dark themes
    "github-dark",
    "popos-dark",
    "vscode-dark",
    "slack-dark",
    "discord-dark",
    "material-dark",
    "one-dark",
    "monokai-dark",
    "oled-dark",
    // Light themes
    "solarized-light",
    "slack-light",
    "discord-light",
    "material-light",
  ],
};

export const menu = createSlice({
  name: "menu",
  initialState,
  reducers: {
    resetMenuSlice: () => {
      return {
        ...initialState,
      };
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      const currentIndex = state.themes.indexOf(state.theme);
      const nextIndex =
        currentIndex >= 0 ? (currentIndex + 1) % state.themes.length : 0;
      state.theme = state.themes[nextIndex];
      state.isThemeDark = /dark/.test(state.theme);
    },
    setIsSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
    },
    setIsMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    toggleLargeText: (state) => {
      state.largeText = !state.largeText;
    },
  },
  extraReducers: () => {},
});

export const { resetMenuSlice, setTheme, setIsSearchOpen, setIsMenuOpen, setIsMobile, toggleTheme, toggleLargeText } =
  menu.actions;

export default menu.reducer;
