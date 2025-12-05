import { createSlice } from "@reduxjs/toolkit";
import { authApi } from '@/app/services/authApi';
import type { User } from "@/types";
import { setToken } from "../auth/authSlice";

interface InitialState {
    user: User | null;
    current: User | null;
    message?: string | null;
    isAuthenticated: boolean;
}

const initialState: InitialState = {
    user: null,
    current: null,
    message: null,
    isAuthenticated: false
};

export const studentSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: () => initialState,
        resetUser: (state) => {
            state.user = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.signinStudent.matchFulfilled, (state, action) => {
                state.isAuthenticated = true;
            })
            .addMatcher(authApi.endpoints.signupStudent.matchFulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.current = action.payload
            })
            .addMatcher(authApi.endpoints.getUserById.matchFulfilled, (state, action) => {
                state.user = action.payload;
            })
    }
});

export const { logout, resetUser } = studentSlice.actions;
export default studentSlice.reducer;