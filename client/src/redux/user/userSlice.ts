import { createSlice } from "@reduxjs/toolkit";
import type { Parent, Student, Teacher, User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { BASE_URL } from "@/constants";
import { setToken } from "../auth/authSlice";
import api from "@/utils/axios";

type Role = 'student' | 'teacher' | 'parent' | 'admin' | 'none';

interface InitialState {
    users: Student[] | Teacher[] | Parent[] | null;
    currentUser: User | null;
    message?: string | null;
    loading: boolean,
    role: Role,
}

const initialState: InitialState = {
    users: null,
    currentUser: null,
    message: null,
    loading: false,
    role: "none"
};

export const registerUser = createAsyncThunk(
    'user/registerStudent',
    async ({ name, email, password, surname, role }: { name: string, email: string, password: string, surname: string, role: string }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signup-${role}`, {
                name,
                email,
                password,
                surname
            });

            if (data) {
                dispatch(setToken(data.token));
            }

            console.log('data from register any of them - asyncThunk', data);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Smth weng wrong in register student' })
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password, role }: { email: string, password: string, role: string }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signin-${role}`, {
                email,
                password
            });

            if (data.token) {
                dispatch(setToken(data.token));
            }

            console.log('data from logInUser', data);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in login student" })
        }
    }
);

export const getMe = createAsyncThunk(
    'user/getMe',
    async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/users/get-me`);

            return data;
        } catch (error) {
            console.log(`error is ${error}`);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ formData, id, role }: { formData: FormData, id: string | undefined, role: Role }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE_URL}/${role}s/update-${role}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in updateUser - student" })
        }
    }
)

export const studentSlice = createSlice({
    name: "user",
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
            .addCase(registerUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.loading = false;
                state.message = action.payload.message;
                state.role = action.payload.role;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message;
            })

            .addCase(loginUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
                state.role = action.payload.role;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(getMe.pending, (state, action) => {
                state.loading = true;
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

            .addCase(updateUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })
    }
});

export const { logOut } = studentSlice.actions;
export default studentSlice.reducer;