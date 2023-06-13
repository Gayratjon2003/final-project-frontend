import { createSlice } from "@reduxjs/toolkit";

export const SnackBarSlice = createSlice({
  name: "snackBar",
  initialState: {
    status: false,
    text: "",
    severity: "success",
  },

  reducers: {
    snackbarStart: (state, { payload: { text, severity } }) => {
      state.status = true;
      state.text = text;
      state.severity = severity;
    },
    snackbarDone: (state) => {
      state.status = false;
    },
  },
});

export const { snackbarStart, snackbarDone } = SnackBarSlice.actions;

export default SnackBarSlice.reducer;
