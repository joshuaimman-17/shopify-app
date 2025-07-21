// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { loginSuccess, logout, updateUserInfo } from './userSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    userinfo: userReducer,
    cartinfo: cartReducer,
  },
});

export default store;
export { loginSuccess, logout, updateUserInfo };
