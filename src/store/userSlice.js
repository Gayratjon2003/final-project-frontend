import { createSlice } from "@reduxjs/toolkit";
import { GET_USER_INFO_URL } from "../constant";
import axios from "axios";

export const TOKEN = "token";
export const userSlice = createSlice({
  name: "user",

  initialState: {
    user: {},
    auth: false,
    isAdmin: false,
    token: "",
  },

  reducers: {
    updateUserInfo: (state, { payload }) => {
      state.user = payload;
    },
    changeToken: (state, { payload: { token } }) => {
      state.token = token;

      localStorage.setItem(TOKEN, JSON.stringify(token));
    },
    clearUser: (state) => {
      state.user = {};
      state.isAdmin = false;
      state.token = "";
      localStorage.setItem(TOKEN, "");
    },
  },
});

export const { updateUserInfo,changeToken, clearUser } = userSlice.actions;

export const getUserInfo = (token) => async (dispatch) => {
  if (!token) {
    return;
  }

  try {
    const { data, status } = await axios.get(GET_USER_INFO_URL, {
      headers: {
        "x-auth-token": token,
      },
    });

    if (status) {
      dispatch(updateUserInfo(data));
    }

    if (Object.keys(data).length <= 0) {
      localStorage.setItem(TOKEN, "");
    }
  } catch (error) {
    console.error(error);
  }
};

export default userSlice.reducer;
