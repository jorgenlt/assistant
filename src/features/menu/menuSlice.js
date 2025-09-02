import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  themes: ["light", "dark", "sunset"],
  largeText: false,
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
    },
    toggleLargeText: (state) => {
      state.largeText = !state.largeText;
    },
  },
  extraReducers: () => {},
});

export const { setTheme, toggleTheme, toggleLargeText } = menu.actions;

export default menu.reducer;
