import { configureStore } from "@reduxjs/toolkit";
import SnackBarSlice from "./SnackbarSlice";
import loaderSlice from "./loaderSlice";
import languageSlice from "./languageSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    snackBar: SnackBarSlice,
    loader: loaderSlice,
    language: languageSlice,
    user: userSlice,
  },
});
