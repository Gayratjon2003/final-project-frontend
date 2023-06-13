import { configureStore } from "@reduxjs/toolkit";
import SnackBarSlice from "./SnackbarSlice";
import loaderSlice from "./loaderSlice";

export const store = configureStore({
  reducer: {
    snackBar: SnackBarSlice,
    loader: loaderSlice,
  },
});
