import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin;
    },
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
