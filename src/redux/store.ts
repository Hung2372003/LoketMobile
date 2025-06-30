import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer, // Đăng ký slice vào store
  },
});

// Export các type để sử dụng trong app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;