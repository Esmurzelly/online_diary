import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { BASE_URL } from "@/constants";
import { setToken } from "../auth/authSlice";

interface InitialState {
    user: User | null;
    currentUser: User | null;
    message?: string | null;
    loading: boolean,
}

const initialState: InitialState = {
    user: null,
    currentUser: null,
    message: null,
    loading: false
};

export const registerStudent = createAsyncThunk(
    'student/registerStudent',
    async ({ name, email, password, surname }: { name: string, email: string, password: string, surname: string }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signup-student`, {
                name,
                email,
                password,
                surname
            });

            if (data) {
                window.localStorage.setItem("access_token", data.token);
                dispatch(setToken(data.token));
            }

            console.log('data from register asyncThunk', data);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Smth weng wrong in register student' })
        }
    }
);

export const loginStudent = createAsyncThunk(
    'student/loginStudent',
    async ({ email, password }: { email: string, password: string }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signin-student`, {
                email,
                password
            });

            if (data.token) {
                window.localStorage.setItem("access_token", data.token);
                dispatch(setToken(data.token));
            }
            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in login student" })
        }
    }
);

export const getMe = createAsyncThunk(
    'student/getMe',
    async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/users/get-me`);
            
            return data;
        } catch (error) {
            console.log(`error is ${error}`);
        }
    }
)

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        logOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerStudent.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading..."
            })
            .addCase(registerStudent.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(registerStudent.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(loginStudent.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading..."
            })
            .addCase(loginStudent.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
            })
            .addCase(loginStudent.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(getMe.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading..."
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })
    }
});

export const { logOut } = studentSlice.actions;
export default studentSlice.reducer;