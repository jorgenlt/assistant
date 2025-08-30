import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  largeText: false,
};

export const menu = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    toggleLargeText: (state) => {
      state.largeText = !state.largeText;
    },
  },
  extraReducers: () => {},
});

// Action creators are generated for each case reducer function
export const { toggleTheme, toggleLargeText } = menu.actions;

export default menu.reducer;
