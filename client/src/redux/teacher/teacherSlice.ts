import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ApiError, GetAllTeachersResponse, Teacher } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/constants";
import api from "@/utils/axios";
import { addTeacherToTheSchool, removeTeacherFromTheSchool } from "../school/schoolSlice";
import { addTeacherToSubject, removeTeacherFromTheSubject } from "../class/classSlice";

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

export const getAllTeachers = createAsyncThunk<GetAllTeachersResponse, void, { rejectValue: ApiError }>(
    'teacher/getAllTeachers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get<GetAllTeachersResponse>(`${BASE_URL}/teachers/get-all-teachers`);

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
            .addCase(getAllTeachers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllTeachers.fulfilled, (state, action: PayloadAction<GetAllTeachersResponse>) => {
                state.teacherList = action.payload.allTeacher;
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(getAllTeachers.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
            })

            .addCase(removeTeacherFromTheSchool.pending, (state) => {
                state.loading = true;
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
            .addCase(removeTeacherFromTheSchool.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
            })

            .addCase(addTeacherToTheSchool.pending, (state) => {
                state.loading = true;
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
            .addCase(addTeacherToTheSchool.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
            })

            .addCase(addTeacherToSubject.pending, (state) => {
                state.loading = true;
            })
            .addCase(addTeacherToSubject.fulfilled, (state, action) => {
                state.loading = false;
                const teacher = state.teacherList?.find(teacherItem => teacherItem.id === action.payload.teacherToSubject.teacherId);

                if (teacher) {
                    teacher.subjects = action.payload.teacherToSubject.teacher.subjects;
                }
                state.message = action.payload.message;
            })
            .addCase(addTeacherToSubject.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
            })

            .addCase(removeTeacherFromTheSubject.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeTeacherFromTheSubject.fulfilled, (state, action) => {
                state.loading = false;
                const { teacherId, removedSubjectFromTeacher } = action.payload;
                const teacher = state.teacherList?.find(teacherItem => teacherItem.id === teacherId);

                if (teacher && teacher.subjects) {
                    teacher.subjects = teacher.subjects.filter(subjectItem => subjectItem.id !== removedSubjectFromTeacher.id);
                }
                state.message = action.payload.message;
            })
            .addCase(removeTeacherFromTheSubject.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
            })
    }
});

export const { } = teacherSlice.actions;
export default teacherSlice.reducer;