import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/rootReducer";
import type { User } from "@/types";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('access_token'),
}

export const aurhSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem("access_token", action.payload)
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem("access_token");
        }
    },
});

// export const checkIsAuth = state => Boolean(state.auth.token);
export const { clearToken, setToken } = aurhSlice.actions;
export default aurhSlice.reducer;