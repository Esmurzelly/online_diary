import { combineReducers } from "@reduxjs/toolkit";
import studentReducer from '@/features/student/studentSlice';
import authReducer from '@/features/auth/authSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    student: studentReducer,
})

export type RootState = ReturnType<typeof rootReducer>