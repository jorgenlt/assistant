import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark",
  isThemeDark: true,
  isSidebarOpen: false,
  isSearchOpen: false,
  isKeyboardShortcutsOpen: false,
  isSettingsOpen: false,
  isMobile: true,
  isEnterSend: false,
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
    "discord-light",
    "material-light",
  ],
};

export const sidebar = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
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
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setIsSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
    },
    setIsKeyboardShortcutsOpen: (state, action) => {
      state.isKeyboardShortcutsOpen = action.payload;
    },
    setIsSettingsOpen: (state, action) => {
      state.isSettingsOpen = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    toggleEnterIsSend: (state) => {
      state.isEnterSend = !state.isEnterSend;
    },
    toggleLargeText: (state) => {
      state.largeText = !state.largeText;
    },
  },
  extraReducers: () => {},
});

export const {
  setTheme,
  setIsSidebarOpen,
  setIsSearchOpen,
  setIsKeyboardShortcutsOpen,
  setIsSettingsOpen,
  setIsMobile,
  toggleEnterIsSend,
  toggleTheme,
  toggleLargeText,
} = sidebar.actions;

export default sidebar.reducer;
