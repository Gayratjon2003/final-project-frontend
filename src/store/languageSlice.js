import { createSlice } from "@reduxjs/toolkit";
import i18n from "../i18n";
const navData = [
  {
    id: 1,
    name: "EN",
    encode: "en",
  },
  {
    id: 2,
    name: "UZ",
    encode: "uz",
  },
];
export const languageSlice = createSlice({
  name: "language",

  initialState: {
    navData: navData,
    selectedLang: navData[0],
  },

  reducers: {
    switchLang: (state, { payload }) => {
      state.selectedLang = payload;
      i18n.changeLanguage(state.selectedLang.encode);
      localStorage.setItem("lang", state.selectedLang.encode);
    },
  },
});
export const { switchLang } = languageSlice.actions;

export default languageSlice.reducer;
