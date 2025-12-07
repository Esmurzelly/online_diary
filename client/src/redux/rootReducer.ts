import { combineReducers } from "@reduxjs/toolkit";
import userReducer from '@/redux/user/userSlice';
import authReducer from '@/redux/auth/authSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>