import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
  name: "loader",

  initialState: {
    isLoading: false,
  },

  reducers: {
    start: (state) => {
      state.isLoading = true;
    },
    done: (state) => {
      state.isLoading = false;
    },
  },
});
export const { start, done } = loaderSlice.actions;

export default loaderSlice.reducer;
