import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
  token: localStorage.getItem('authToken') || null,
  refreshHome: false, // Thêm trạng thái để kích hoạt reload
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('authToken', action.payload);
        state.isLoggedIn = true;
      } else {
        localStorage.removeItem('authToken');
        state.isLoggedIn = false;
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.refreshHome = false;
      localStorage.removeItem('authToken');
    },
    refreshHome: (state) => {
      state.refreshHome = !state.refreshHome; // Toggle để kích hoạt reload
    },
  },
});

export const { setIsLoggedIn, setUser, setToken, logout, refreshHome } = authSlice.actions;
export default authSlice.reducer;