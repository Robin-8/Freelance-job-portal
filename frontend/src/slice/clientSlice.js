import { createSlice } from "@reduxjs/toolkit";

// Helper to get user from localStorage and ensure proper format
const getUserFromStorage = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      // Ensure _id is set (handle both old and new formats)
      if (user.id && !user._id) {
        user._id = user.id;
      }
      return user;
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("userInfo");
  }
  return null;
};

const userInfo = getUserFromStorage();
const token = localStorage.getItem("token") || null;

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
