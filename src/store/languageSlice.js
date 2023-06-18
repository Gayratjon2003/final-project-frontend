import { createSlice } from "@reduxjs/toolkit";
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
    },
  },
});
export const { switchLang } = languageSlice.actions;

export default languageSlice.reducer;
