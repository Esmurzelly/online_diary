import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ApiError, GetAllStudentsResponse, GetStudentsFromOneClassResponse, Parent, RemoveGradeResponse, SetGradeResponse, Student, Teacher, UpdateGradeResponse, User } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "@/constants";
import api from "@/utils/axios";


interface InitialState {
    student: Student | null;
    studentsList: Student[] | null;
    message?: string | null;
    loading: boolean,
}

const initialState: InitialState = {
    student: null,
    studentsList: null,
    message: null,
    loading: false,

};

export const getAllStudents = createAsyncThunk<GetAllStudentsResponse, void, { rejectValue: ApiError }>(
    'student/getAllStudents',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get<GetAllStudentsResponse>(`${BASE_URL}/students/get-all-students`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getAllStudents" })
        }
    }
);

export const getAllStudentsFromOneClass = createAsyncThunk<GetStudentsFromOneClassResponse, { classId: string }, { rejectValue: ApiError }>(
    'student/getAllStudentsFromOneClass',
    async ({ classId }: { classId: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.get<GetStudentsFromOneClassResponse>(`${BASE_URL}/students/get-students-from-one-class/${classId}`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in getAllStudentsFromOneClass" })
        }
    }
);

export const setGrade = createAsyncThunk<SetGradeResponse, { subjectId: string; studentId: string; teacherId: string; comment: string; value: number; dateTime?: Date }, { rejectValue: ApiError }>(
    'student/setGrade',
    async ({ subjectId, studentId, teacherId, comment, value, dateTime }, { rejectWithValue }) => {
        try {
            const { data } = await api.post<SetGradeResponse>(`${BASE_URL}/grades/create-grade`, {
                subjectId,
                studentId,
                teacherId,
                comment,
                value,
                dateTime
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in setGrade" })
        }
    }
);

export const updateGrade = createAsyncThunk<UpdateGradeResponse, { subjectId: string; studentId: string; teacherId: string; gradeId: string; value?: number; comment?: string }, { rejectValue: ApiError }>(
    'student/updateGrade',
    async ({ teacherId, studentId, subjectId, gradeId, value, comment }, { rejectWithValue }) => {

        try {
            const { data } = await api.put<UpdateGradeResponse>(`${BASE_URL}/grades/update-grade`, {
                subjectId,
                studentId,
                teacherId,
                gradeId,
                value,
                comment
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in updateGrade" })
        }
    }
);

export const removeGrade = createAsyncThunk<RemoveGradeResponse, { subjectId: string; studentId: string; teacherId: string; gradeId: string }, { rejectValue: ApiError }>(
    'student/removeGrade',
    async ({ subjectId, studentId, teacherId, gradeId }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete<RemoveGradeResponse>(`${BASE_URL}/grades/remove-grade`, {
                data: {
                    subjectId,
                    studentId,
                    teacherId,
                    gradeId
                }
            });

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeGrade" })
        }
    }
);

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllStudents.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllStudents.fulfilled, (state, action: PayloadAction<GetAllStudentsResponse>) => {
                state.message = action.payload.message;
                state.studentsList = action.payload.allStudents;
                state.loading = false;
            })
            .addCase(getAllStudents.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(getAllStudentsFromOneClass.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllStudentsFromOneClass.fulfilled, (state, action: PayloadAction<GetStudentsFromOneClassResponse>) => {
                state.message = action.payload.message;
                state.studentsList = action.payload.students;
                state.loading = false;
            })
            .addCase(getAllStudentsFromOneClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(setGrade.pending, (state) => {
                state.loading = true;
            })
            .addCase(setGrade.fulfilled, (state, action: PayloadAction<SetGradeResponse>) => {
                state.message = action.payload.message;
                const student = state.studentsList?.find(studentItem => studentItem.id === action.payload.grade.studentId);

                if (student) {
                    if (!student.grades) {
                        student.grades = [];
                    }

                    student.grades.push(action.payload.grade);
                }
                state.loading = false;
            })
            .addCase(setGrade.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(removeGrade.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeGrade.fulfilled, (state, action: PayloadAction<RemoveGradeResponse>) => {
                state.message = action.payload.message;

                const { grade } = action.payload;
                const student = state.studentsList?.find(studentItem => studentItem.id === grade.studentId);

                if (student && student.grades) {
                    student.grades = student.grades.filter(gradeItem => gradeItem.id !== grade.id)
                }
                state.loading = false;
            })
            .addCase(removeGrade.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(updateGrade.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateGrade.fulfilled, (state, action: PayloadAction<UpdateGradeResponse>) => {
                state.message = action.payload.message;

                const updatedGrade = action.payload.updatedGrade;
                const student = state.studentsList?.find(studentItem => studentItem.id === updatedGrade.studentId);

                if (student && student.grades) {
                    const gradeIndex = student.grades.findIndex(
                        gradeItem => gradeItem.id === updatedGrade.id
                    );

                    if (gradeIndex !== -1) {
                        student.grades[gradeIndex] = updatedGrade;
                    };
                }

                state.loading = false;
            })
            .addCase(updateGrade.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })
    }
});

export const { } = studentSlice.actions;
export default studentSlice.reducer;