import { combineReducers } from "@reduxjs/toolkit";
import userReducer from '@/features/user/userSlice';
// other reducers

export const rootReducer = combineReducers({
    user: userReducer
})

export type RootState = ReturnType<typeof rootReducer>