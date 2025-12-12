import { combineReducers } from "@reduxjs/toolkit";
import userReducer from '@/redux/user/userSlice';
import authReducer from '@/redux/auth/authSlice';
import schoolReducer from '@/redux/school/schoolSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    school: schoolReducer,
})

export type RootState = ReturnType<typeof rootReducer>