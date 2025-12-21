import { createSlice } from "@reduxjs/toolkit";
import type { Parent, Student, Teacher, User } from "@/types";
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

export const getAllStudentsFromOneClass = createAsyncThunk(
    'student/getAllStudentsFromOneClass',
    async ({ classId }: { classId: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`${BASE_URL}/students/get-students-from-one-class/${classId}`);

            return data;
        } catch (error: any) {
            return rejectWithValue({ message: error.message || "smth weng wrong in removeUser" })
        }
    }
);

export const setGrade = createAsyncThunk(
    'student/setGrade',
    async ({ subjectId, studentId, teacherId, comment, value, dateTime }: { subjectId: string | undefined, studentId: string | undefined, teacherId: string, comment: string, value: number, dateTime: Date | undefined }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`${BASE_URL}/grades/create-grade`, {
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

export const updateGrade = createAsyncThunk(
    'student/updateGrade',
    async ({ teacherId, studentId, subjectId, gradeId, value, comment }: { subjectId: string | undefined, studentId: string | undefined, teacherId: string, gradeId: string, value: number | undefined, comment: string | undefined }, { rejectWithValue }) => {

        try {
            const { data } = await api.put(`${BASE_URL}/grades/update-grade`, {
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

export const removeGrade = createAsyncThunk(
    'student/removeGrade',
    async ({ subjectId, studentId, teacherId, gradeId }: { subjectId: string | undefined, studentId: string | undefined, teacherId: string, gradeId: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`${BASE_URL}/grades/remove-grade`, {
                data: {
                    subjectId, 
                    studentId, 
                    teacherId, 
                    gradeId
                }
            });

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

            .addCase(getAllStudentsFromOneClass.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAllStudentsFromOneClass.fulfilled, (state, action) => {
                state.message = action.payload.message;
                state.studentsList = action.payload.students;
                state.loading = false;
            })
            .addCase(getAllStudentsFromOneClass.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(setGrade.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(setGrade.fulfilled, (state, action) => {
                state.message = action.payload.message;
                const student = state.studentsList?.find(studentItem => studentItem.id === action.payload.grade.studentId);

                if (student) {
                    if (!student.grades) {
                        student.grades = [];
                    }

                    student.grades.push(action.payload.grade); // common
                }
                state.loading = false;
            })
            .addCase(setGrade.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })

            .addCase(removeGrade.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(removeGrade.fulfilled, (state, action) => {
                state.message = action.payload.message;
                const { grade } = action.payload;
                const student = state.studentsList?.find(studentItem => studentItem.id === grade.studentId);

                if (student) {
                    student.grades = student.grades.filter(gradeItem => gradeItem.id !== grade.id)
                }
                state.loading = false;
            })
            .addCase(removeGrade.rejected, (state, action) => {
                state.loading = false;
                state.message = action.error.message
            })            

            .addCase(updateGrade.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateGrade.fulfilled, (state, action) => {
                state.message = action.payload.message;
                console.log('action.payload.updatedGrade.studentId', action.payload.updatedGrade.studentId);

                const updatedGrade = action.payload.updatedGrade;
                const student = state.studentsList?.find(
                    studentItem => studentItem.id === updatedGrade.studentId
                );

                if (!student || !student.grades) return;

                const gradeIndex = student.grades.findIndex(
                    gradeItem => gradeItem.id === updatedGrade.id
                );

                
                if (gradeIndex !== -1) {
                    student.grades[gradeIndex] = updatedGrade;
                };
                
                student.grades[gradeIndex] = updatedGrade;

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