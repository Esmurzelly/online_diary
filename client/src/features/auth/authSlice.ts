import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from '@/app/services/authApi';
import type { RootState } from "@/app/rootReducer";
import type { User } from "@/types";

interface AuthState {
  token: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
}

export const aurhSlice = createSlice({
    name: "aurh",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload)
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        }
    },
});

export const { clearToken, setToken } = aurhSlice.actions;
export default aurhSlice.reducer;