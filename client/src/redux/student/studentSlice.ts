import { createSlice } from "@reduxjs/toolkit";
import type { Parent, Student, Teacher, User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/constants";
import api from "@/utils/axios";


interface InitialState {
    student: Student[] | null;
    studentsList: Student[] | null;
    message?: string | null;
    loading: boolean,
}

const initialState: InitialState = {
    student: null,
    studentsList: [],
    message: null,
    loading: false,

};

export const getAllStudents = createAsyncThunk(
    'user/getAllStudents',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`${BASE_URL}/students/get-all-students`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeUser" })
        }
    }
);

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllStudents.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAllStudents.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.studentsList = action.payload.allStudents;
                state.loading = false;
            })
            .addCase(getAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })
    }
});

export const {  } = studentSlice.actions;
export default studentSlice.reducer;