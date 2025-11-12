import { createSlice } from "@reduxjs/toolkit";

const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const clientSlice = createSlice({
  name: "client",
  initialState: {
    user: userInfo,
    token: token,
    isAuthenticated: !!token,
  },
  reducers: {
    registerSuccess: (state, action) => {
      const { user, token } = action.payload;
      (state.user = user), (state.token = token);
      state.isAuthenticated = true;
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    login: (state, action) => {
      const { user, token } = action.payload;
      (state.user = user), (state.token = token);
      state.isAuthenticated = true;
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      (state.user = null),
        (state.token = null),
        (state.isAuthenticated = false);
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
  },
});

export const { registerSuccess, login, logout } = clientSlice.actions;
export default clientSlice.reducer;
