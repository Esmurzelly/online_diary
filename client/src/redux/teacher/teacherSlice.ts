import { createSlice } from "@reduxjs/toolkit";
import type { Parent, Student, Teacher, User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/constants";
import { clearToken, setToken } from "../auth/authSlice";
import api from "@/utils/axios";
import { addTeacherToTheSchool, removeTeacherFromTheSchool } from "../school/schoolSlice";
import { addTeacherToSubject } from "../class/classSlice";

type Role = 'student' | 'teacher' | 'parent' | 'admin' | 'none';

interface InitialState {
    teacherList: Teacher[] | null;
    currentTeacher: Teacher | null;
    message?: string | null;
    loading: boolean,
}

const initialState: InitialState = {
    teacherList: null,
    currentTeacher: null,
    message: null,
    loading: false,
};

export const getAllTeachers = createAsyncThunk(
    'teacher/getAllTeachers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`${BASE_URL}/teachers/get-all-teachers`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getAllTeachers" })

        }
    }
);

export const teacherSlice = createSlice({
    name: "teacher",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTeachers.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAllTeachers.fulfilled, (state, action) => {
                state.teacherList = action.payload.allTeacher;
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(getAllTeachers.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message;
            })

            .addCase(removeTeacherFromTheSchool.fulfilled, (state, action) => {
                state.loading = false;
                const removedTeacherId = action.payload.data.id;

                const teacher = state.teacherList?.find(teacherItem => teacherItem.id === removedTeacherId);

                if (teacher) {
                    teacher.schoolId = null;
                }

                state.message = action.payload.message;
            })

            .addCase(addTeacherToTheSchool.fulfilled, (state, action) => {
                state.loading = false;
                const addedTeacher = action.payload.data;

                const teacher = state.teacherList?.find(teacherItem => teacherItem.id === addedTeacher.id);

                if (teacher) {
                    teacher.schoolId = addedTeacher.schoolId
                }

                state.message = action.payload.message;
            })

            .addCase(addTeacherToSubject.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addTeacherToSubject.fulfilled, (state, action) => {
                state.loading = false;
                const teacher = state.teacherList?.find(teacherItem => teacherItem.id === action.payload.teacherToSubject.teacherId);

                if(teacher) {
                    if(Array.isArray(teacher.subjects)) {
                        teacher.subjects.push(action.payload.teacherToSubject); // new Set in teacher -> teacherList.[1].subjects in server!!!!!!!!!!!!!!!!
                    } else {
                        teacher.subjects = [...action.payload.teacherToSubject]
                    }
                }
                state.message = action.payload.message;
            })
            .addCase(addTeacherToSubject.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
    }
});

export const { } = teacherSlice.actions;
export default teacherSlice.reducer;