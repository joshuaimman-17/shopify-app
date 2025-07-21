import { createSlice } from '@reduxjs/toolkit';

// Check for existing session on app startup
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');

  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      return {
        user,
        isLoggedIn: true,
        token,
      };
    } catch (error) {
      // If parsing fails, clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
  }

  return {
    user: null,
    isLoggedIn: false,
    token: null,
  };
};

const initialState = getInitialState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.token = action.payload.token;

      // Store both token and user data in localStorage for persistence
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      // Remove all user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('mockOrders'); // Clear mock orders on logout
    },
    updateUserInfo(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginSuccess, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
