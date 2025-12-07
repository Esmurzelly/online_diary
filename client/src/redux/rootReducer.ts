import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from '@/redux/user/studentSlice';
import authReducer from '@/redux/auth/authSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    student: studentReducer,
})

export type RootState = ReturnType<typeof rootReducer>