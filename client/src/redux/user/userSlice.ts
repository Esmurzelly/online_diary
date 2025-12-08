import { createSlice } from "@reduxjs/toolkit";
import type { Parent, Student, Teacher, User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { BASE_URL } from "@/constants";
import { setToken } from "../auth/authSlice";
import api from "@/utils/axios";

type Role = 'student' | 'teacher' | 'parent' | 'admin';

interface InitialState {
    user: Student | Teacher | Parent | null;
    currentUser: User | null;
    message?: string | null;
    loading: boolean,
    role: Role | null
}

const initialState: InitialState = {
    user: null,
    currentUser: null,
    message: null,
    loading: false,
    role: null
};

export const registerStudent = createAsyncThunk(
    'user/registerStudent',
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

export const registerTeacher = createAsyncThunk(
    'user/registerTeacher',
    async ({ name, email, password, surname }: { name: string, email: string, password: string, surname: string }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signup-teacher`, {
                name,
                email,
                password,
                surname
            });

            if (data) {
                window.localStorage.setItem("access_token", data.token);
                dispatch(setToken(data.token));
            }

            console.log('data from register asyncThunk - teacher', data);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Smth weng wrong in register student' })
        }
    }
);

export const registerParent = createAsyncThunk(
    'user/registerParent',
    async ({ name, email, password, surname }: { name: string, email: string, password: string, surname: string }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signup-parent`, {
                name,
                email,
                password,
                surname
            });

            if (data) {
                window.localStorage.setItem("access_token", data.token);
                dispatch(setToken(data.token));
            }

            console.log('data from register asyncThunk - teacher', data);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || 'Smth weng wrong in register student' })
        }
    }
);

export const loginStudent = createAsyncThunk(
    'user/loginStudent',
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

export const loginTeacher = createAsyncThunk(
    'user/loginTeacher',
    async ({ email, password }: { email: string, password: string }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signin-teacher`, {
                email,
                password
            });

            if (data.token) {
                window.localStorage.setItem("access_token", data.token);
                dispatch(setToken(data.token));
            }

            console.log('data loginTeacher from asyncThunk', data)

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in login student" })
        }
    }
);

export const loginParent = createAsyncThunk(
    'user/loginParent',
    async ({ email, password }: { email: string, password: string }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/auth/signin-parent`, {
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

export const updateStudent = createAsyncThunk(
    'user/updateStudent',
    async ({formData, id}: { formData: FormData, id: string | undefined }, { rejectWithValue }) => {
        console.log(`link - ${BASE_URL}/students/update-student/${id}`)
        try {
            const { data } = await api.put(`${BASE_URL}/students/update-student/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log('data from updateStudent Slice', data);

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
            .addCase(registerStudent.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading...";
            })
            .addCase(registerStudent.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.loading = false;
                state.message = action.payload.message;
                state.role = "student";
            })
            .addCase(registerStudent.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message;
            })

            .addCase(registerTeacher.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading...";
            })
            .addCase(registerTeacher.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.loading = false;
                state.message = action.payload.message;
                state.role = "teacher";
            })
            .addCase(registerTeacher.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(registerParent.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading..."
            })
            .addCase(registerParent.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.loading = false;
                state.message = action.payload.message;
                state.role = "parent";
            })
            .addCase(registerParent.rejected, (state, action) => {
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
                state.role = "student";
            })
            .addCase(loginStudent.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(loginTeacher.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading..."
            })
            .addCase(loginTeacher.fulfilled, (state, action) => {
                state.message = action.payload.message;
                console.log('action.payload from extra reducer', action.payload)
                state.currentUser = action.payload.user;
                state.loading = false;
                state.role = "teacher";
            })
            .addCase(loginTeacher.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(loginParent.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading..."
            })
            .addCase(loginParent.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
                state.role = "parent";
            })
            .addCase(loginParent.rejected, (state, action) => {
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

            .addCase(updateStudent.pending, (state, action) => {
                state.loading = true;
                state.message = "Loading..."
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.currentUser = action.payload.user;
                state.loading = false;
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })
    }
});

export const { logOut } = studentSlice.actions;
export default studentSlice.reducer;