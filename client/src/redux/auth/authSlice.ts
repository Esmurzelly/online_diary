import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../rootReducer";

interface AuthState {
  token: string | null;
  isAuthentificated: boolean;
};

const initialState: AuthState = {
  token: localStorage.getItem('access_token'),
  isAuthentificated: false
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('access_token', action.payload);
            state.isAuthentificated = true;
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem('access_token');
            state.isAuthentificated = false;
        }
    },
});

export const checkIsAuth = (state: RootState): boolean => state.auth.isAuthentificated;
export const getToken = (state: RootState): string | null => state.auth.token;

export const { clearToken, setToken } = authSlice.actions;
export default authSlice.reducer;